import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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
    });

    if (share.uploadLocked)
      throw new BadRequestException("Share is already completed");

    await fs.promises.mkdir(`./data/uploads/shares/${shareId}`, {
      recursive: true,
    });

    // Calculate expected chunk index from the temporary file on the server
    let expectedChunkIndex: number;
    try {
      const chunkSize = 10 * 1024 * 1024; // 10MB
      const diskFileSize = fs.statSync(
        `./data/uploads/shares/${shareId}/${file.id}.tmp`
      ).size;
      expectedChunkIndex = Math.ceil(diskFileSize / chunkSize);
    } catch {
      expectedChunkIndex = 0;
    }

    // If the sent chunk index and the expected chunk index doesn't match throw an error
    if (expectedChunkIndex != chunk.index)
      throw new BadRequestException({
        message: "Unexpected chunk received",
        error: "unexpected_chunk_index",
        expectedChunkIndex,
      });

    const buffer = Buffer.from(data, "base64");

    fs.appendFileSync(
      `./data/uploads/shares/${shareId}/${file.id}.tmp`,
      buffer
    );

    const isLastChunk = chunk.index == chunk.total - 1;
    if (isLastChunk) {
      fs.renameSync(
        `./data/uploads/shares/${shareId}/${file.id}.tmp`,
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
