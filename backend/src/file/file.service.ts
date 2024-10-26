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
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command, DeleteObjectsCommand
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Injectable()
export class FileService {

  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private config: ConfigService,
  ) {}

  async create(
      data: string,
      chunk: { index: number; total: number },
      file: { id?: string; name: string },
      shareId: string,
  ) {
    if (!file.id) file.id = crypto.randomUUID();

    const share = await this.prisma.share.findUnique({
      where: { id: shareId },
      include: { files: true, reverseShare: true },
    });

    if (share.uploadLocked)
      throw new BadRequestException("Share is already completed");

    let diskFileSize = 0;

    const s3 = this.createS3Instance()
    if (this.config.get("s3.enabled") && s3) {
      try {
        const object = await s3.send(new GetObjectCommand({
          Bucket: this.config.get("s3.bucketName"),
          Key: `${this.getS3Path()}${shareId}/${file.id}.tmp-chunk`,
        }));
        diskFileSize = object.ContentLength || 0;
      } catch {
        diskFileSize = 0;
      }
    } else {
      try {
        diskFileSize = fs.statSync(
            `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`,
        ).size;
      } catch {
        diskFileSize = 0;
      }
    }

    const chunkSize = this.config.get("share.chunkSize");
    const expectedChunkIndex = Math.ceil(diskFileSize / chunkSize);

    if (expectedChunkIndex !== chunk.index) {
      throw new BadRequestException({
        message: "Unexpected chunk received",
        error: "unexpected_chunk_index",
        expectedChunkIndex,
      });
    }

    const buffer = Buffer.from(data, "base64");

    const fileSizeSum = share.files.reduce(
        (n, { size }) => n + parseInt(size),
        0,
    );

    const shareSizeSum = fileSizeSum + diskFileSize + buffer.byteLength;

    if (
        shareSizeSum > this.config.get("share.maxSize") ||
        (share.reverseShare?.maxShareSize &&
            shareSizeSum > parseInt(share.reverseShare.maxShareSize))
    ) {
      throw new HttpException(
          "Max share size exceeded",
          HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    if (this.config.get("s3.enabled") && s3) {
      await s3.send(new PutObjectCommand({
        Bucket: this.config.get("s3.bucketName"),
        Key: `${this.getS3Path()}${shareId}/${file.id}.tmp-chunk`,
        Body: buffer,
      }));
    } else {
      fs.appendFileSync(
          `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`,
          buffer,
      );
    }

    const isLastChunk = chunk.index === chunk.total - 1;
    if (isLastChunk) {

      const s3 = this.createS3Instance()
      if (this.config.get("s3.enabled") && s3) {
        await s3.send(new PutObjectCommand({
          Bucket: this.config.get("s3.bucketName"),
          Key: `${shareId}/${file.id}`,
          Body: buffer,
        }));
      } else {
        fs.renameSync(
            `${SHARE_DIRECTORY}/${shareId}/${file.id}.tmp-chunk`,
            `${SHARE_DIRECTORY}/${shareId}/${file.id}`,
        );
      }

      const fileSize = this.config.get("s3.enabled")
          ? buffer.byteLength
          : fs.statSync(`${SHARE_DIRECTORY}/${shareId}/${file.id}`).size;

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

    const s3 = this.createS3Instance()
    if (this.config.get("s3.enabled") && s3) {
      const response = await s3.send(new GetObjectCommand({
        Bucket: this.config.get("s3.bucketName"),
        Key: `${this.getS3Path()}${shareId}/${fileId}`,
      }));
      return {
        metaData: {
          mimeType: mime.contentType(fileMetaData.name.split(".").pop()),
          ...fileMetaData,
          size: fileMetaData.size,
        },
        file: response.Body as Readable,
      };
    }

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

    const s3 = this.createS3Instance()
    if (this.config.get("s3.enabled") && s3) {
      await s3.send(new DeleteObjectCommand({
        Bucket: this.config.get("s3.bucketName"),
        Key: `${this.getS3Path()}${shareId}/${fileId}`,
      }));
    } else {
      fs.unlinkSync(`${SHARE_DIRECTORY}/${shareId}/${fileId}`);
    }

    await this.prisma.file.delete({ where: { id: fileId } });
  }

  async deleteAllFiles(shareId: string) {
    const s3 = this.createS3Instance()
    if (this.config.get("s3.enabled") && s3) {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.config.get("s3.bucketName"),
        Prefix: `${this.getS3Path()}${shareId}`,
      });
      let list = await s3.send(listCommand);
      if (list.KeyCount) { // if items to delete
        // delete the files
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: this.config.get("s3.bucketName"),
          Delete: {
            Objects: list.Contents.map((item) => ({ Key: item.Key })),
            Quiet: false,
          },
        });
        let deleted = await s3.send(deleteCommand); // delete the files
        if (deleted.Errors) {
          deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`));
        }
        return `${deleted.Deleted.length} files deleted.`;
      }
      // S3 does not support deleting directories, so list all objects in the folder and delete them
      // Implementation needed here to list and delete each object
    } else {
      await fs.promises.rm(`${SHARE_DIRECTORY}/${shareId}`, {
        recursive: true,
        force: true,
      });
    }
  }

  getZip(shareId: string) {
    if (this.config.get("s3.enabled")) {
      throw new BadRequestException("Zip download is not supported with S3 storage");
    }
    return fs.createReadStream(`${SHARE_DIRECTORY}/${shareId}/archive.zip`);
  }

  getS3Path(): string{
    const configS3Path = this.config.get("s3.bucketPath")
    return configS3Path ? `${configS3Path}/` : ""
  }

  createS3Instance(): S3Client{
    if (this.config.get("s3.enabled")) {
      return new S3Client({
        endpoint: this.config.get("s3.endpoint"),
        region: this.config.get("s3.region"),
        credentials: {
          accessKeyId: this.config.get("s3.key"),
          secretAccessKey: this.config.get("s3.secret"),
        },
        forcePathStyle: true,
      });
    }
  }
}
