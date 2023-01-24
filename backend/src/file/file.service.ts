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
      include: { files: true, reverseShareToken: true },
    });

    if (share.uploadLocked)
      throw new BadRequestException("Share is already completed");

    let diskFileSize: number;
    try {
      diskFileSize = fs.statSync(
        `./data/uploads/shares/${shareId}/${file.id}.tmp-chunk`
      ).size;
    } catch {
      diskFileSize = 0;
    }

    // If the sent chunk index and the expected chunk index doesn't match throw an error
    const chunkSize = 10 * 1024 * 1024; // 10MB
    const expectedChunkIndex = Math.ceil(diskFileSize / chunkSize);

    if (expectedChunkIndex != chunk.index)
      throw new BadRequestException({
        message: "Unexpected chunk received",
        error: "unexpected_chunk_index",
        expectedChunkIndex,
      });

    const buffer = Buffer.from(data, "base64");

    // Check if share size limit is exceeded
    const fileSizeSum = share.files.reduce(
      (n, { size }) => n + parseInt(size),
      0
    );

    const shareSizeSum = fileSizeSum + diskFileSize + buffer.byteLength;

    if (
      shareSizeSum > this.config.get("MAX_SHARE_SIZE") ||
      (share.reverseShareToken.maxShareSize &&
        shareSizeSum > parseInt(share.reverseShareToken.maxShareSize))
    ) {
      throw new HttpException(
        "Max share size exceeded",
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }

    fs.appendFileSync(
      `./data/uploads/shares/${shareId}/${file.id}.tmp-chunk`,
      buffer
    );

    const isLastChunk = chunk.index == chunk.total - 1;
    if (isLastChunk) {
      fs.renameSync(
        `./data/uploads/shares/${shareId}/${file.id}.tmp-chunk`,
        `./data/uploads/shares/${shareId}/${file.id}`
      );
      const fileSize = fs.statSync(
        `./data/uploads/shares/${shareId}/${file.id}`
      ).size;
      await this.prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          size: fileSize.toString(),
          share: { connect: { id: shareId } },
        },
      });
    }

    return file;
  }

  async get(shareId: string, fileId: string) {
    const fileMetaData = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileMetaData) throw new NotFoundException("File not found");

    const file = fs.createReadStream(
      `./data/uploads/shares/${shareId}/${fileId}`
    );

    return {
      metaData: {
        mimeType: mime.contentType(fileMetaData.name.split(".").pop()),
        ...fileMetaData,
        size: fileMetaData.size,
      },
      file,
    };
  }

  async deleteAllFiles(shareId: string) {
    await fs.promises.rm(`./data/uploads/shares/${shareId}`, {
      recursive: true,
      force: true,
    });
  }

  getZip(shareId: string) {
    return fs.createReadStream(`./data/uploads/shares/${shareId}/archive.zip`);
  }

  getFileDownloadUrl(shareId: string, fileId: string) {
    const downloadToken = this.generateFileDownloadToken(shareId, fileId);

    return `${this.config.get(
      "APP_URL"
    )}/api/shares/${shareId}/files/${fileId}?token=${downloadToken}`;
  }

  generateFileDownloadToken(shareId: string, fileId: string) {
    if (fileId == "zip") fileId = undefined;

    return this.jwtService.sign(
      {
        shareId,
        fileId,
      },
      {
        expiresIn: "10min",
        secret: this.config.get("JWT_SECRET"),
      }
    );
  }

  verifyFileDownloadToken(shareId: string, token: string) {
    try {
      const claims = this.jwtService.verify(token, {
        secret: this.config.get("JWT_SECRET"),
      });
      return claims.shareId == shareId;
    } catch {
      return false;
    }
  }
}
