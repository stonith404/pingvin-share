import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import * as fs from "fs";
import * as mime from "mime-types";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
import { SHARE_DIRECTORY } from "../constants";
import * as diskusage from "diskusage";

const MAX_RETRIES = 3;

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async create(
    data: string,
    chunk: { index: number; total: number },
    file: { id?: string; name: string },
    shareId: string
  ) {
    if (!file.id) file.id = crypto.randomUUID();

    const share = await this.prisma.share.findUnique({
      where: { id: shareId },
      include: { files: true, reverseShare: true },
    });

    if (share.uploadLocked)
      throw new BadRequestException("Share is already completed");

    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES && !success) {
      try {
        const { available } = diskusage.checkSync("/");
        const buffer = Buffer.from(data, "base64");
        const fileSize = buffer.byteLength;

        if (available < fileSize) {
          throw new Error("Not enough disk space");
        }

        let diskFileSize: number;
        try {
          diskFileSize = fs.statSync(
            `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`
          ).size;
        } catch {
          diskFileSize = 0;
        }

        const chunkSize = this.config.get("share.chunkSize");
        const expectedChunkIndex = Math.ceil(diskFileSize / chunkSize);

        if (expectedChunkIndex != chunk.index)
          throw new BadRequestException({
            message: "Unexpected chunk received",
            error: "unexpected_chunk_index",
            expectedChunkIndex,
          });

        const fileSizeSum = share.files.reduce(
          (n, { size }) => n + parseInt(size),
          0
        );

        const shareSizeSum = fileSizeSum + diskFileSize + buffer.byteLength;

        if (
          shareSizeSum > this.config.get("share.maxSize") ||
          (share.reverseShare?.maxShareSize &&
            shareSizeSum > parseInt(share.reverseShare.maxShareSize))
        ) {
          throw new HttpException(
            "Max share size exceeded",
            HttpStatus.PAYLOAD_TOO_LARGE
          );
        }

        fs.appendFileSync(
          `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`,
          buffer
        );

        const isLastChunk = chunk.index == chunk.total - 1;
        if (isLastChunk) {
          fs.renameSync(
            `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`,
            `${SHARE_DIRECTORY}/${shareId}/${file.id}`
          );
          const finalFileSize = fs.statSync(
            `${SHARE_DIRECTORY}/${shareId}/${file.id}`
          ).size;
          await this.prisma.file.create({
            data: {
              id: file.id,
              name: file.name,
              size: finalFileSize.toString(),
              share: { connect: { id: shareId } },
            },
          });
        }

        success = true; // Mark as successful if no errors
      } catch (error) {
        retries++;
        if (retries >= MAX_RETRIES) {
          // Clean up failed upload
          fs.unlinkSync(`${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`);
          throw new BadRequestException(
            "Upload failed after multiple attempts"
          );
        }
      }
    }

    return file;
  }

  async get(shareId: string, fileId: string) {
    const fileMetaData = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileMetaData) throw new NotFoundException("File not found");

    const file = fs.createReadStream(`${SHARE_DIRECTORY}/${shareId}/${fileId}`);

    return {
      metaData: {
        mimeType: mime.contentType(fileMetaData.name.split(".").pop()),
        ...fileMetaData,
        size: fileMetaData.size,
      },
      file,
    };
  }

  async remove(shareId: string, fileId: string) {
    const fileMetaData = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileMetaData) throw new NotFoundException("File not found");

    fs.unlinkSync(`${SHARE_DIRECTORY}/${shareId}/${fileId}`);

    await this.prisma.file.delete({ where: { id: fileId } });
  }

  async deleteAllFiles(shareId: string) {
    await fs.promises.rm(`${SHARE_DIRECTORY}/${shareId}`, {
      recursive: true,
      force: true,
    });
  }

  getZip(shareId: string) {
    return fs.createReadStream(`${SHARE_DIRECTORY}/${shareId}/archive.zip`);
  }
}
