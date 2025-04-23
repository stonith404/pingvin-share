import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
  UploadPartCommandOutput,
} from "@aws-sdk/client-s3";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "src/config/config.service";
import * as crypto from "crypto";
import * as mime from "mime-types";
import { File } from "./file.service";
import { Readable } from "stream";
import { validate as isValidUUID } from "uuid";

@Injectable()
export class S3FileService {
  private readonly logger = new Logger(S3FileService.name);

  private multipartUploads: Record<
    string,
    {
      uploadId: string;
      parts: Array<{ ETag: string | undefined; PartNumber: number }>;
    }
  > = {};

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(
    data: string,
    chunk: { index: number; total: number },
    file: { id?: string; name: string },
    shareId: string,
  ) {
    if (!file.id) {
      file.id = crypto.randomUUID();
    } else if (!isValidUUID(file.id)) {
      throw new BadRequestException("Invalid file ID format");
    }

    if (!shareId || shareId.includes("/")) {
      throw new BadRequestException("Invalid share ID format");
    }

    if (!file.name || file.name.includes("..")) {
      throw new BadRequestException("Invalid file name");
    }

    const buffer = Buffer.from(data, "base64");
    const key = `${this.getS3Path()}${shareId}/${file.name}`;
    const bucketName = this.config.get("s3.bucketName");
    const s3Instance = this.getS3Instance();

    this.logger.debug(
      `Processing chunk ${chunk.index + 1}/${chunk.total} for file "${key}"`,
    );

    try {
      if (chunk.index === 0) {
        const multipartInitResponse = await s3Instance.send(
          new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );

        const uploadId = multipartInitResponse.UploadId;
        if (!uploadId) {
          throw new Error("Failed to initialize multipart upload.");
        }

        this.multipartUploads[file.id] = {
          uploadId,
          parts: [],
        };

        this.logger.debug(
          `Initialized multipart upload for "${key}" with uploadId "${uploadId}"`,
        );
      }

      const multipartUpload = this.multipartUploads[file.id];

      if (!multipartUpload) {
        throw new InternalServerErrorException(
          "Multipart upload session not found.",
        );
      }

      const uploadId = multipartUpload.uploadId;

      const partNumber = chunk.index + 1; // Part numbers start from 1

      const uploadPartResponse: UploadPartCommandOutput = await s3Instance.send(
        new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: buffer,
        }),
      );

      multipartUpload.parts.push({
        ETag: uploadPartResponse.ETag,
        PartNumber: partNumber,
      });

      this.logger.debug(`Uploaded part ${partNumber} for "${key}"`);

      if (chunk.index === chunk.total - 1) {
        await s3Instance.send(
          new CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
              Parts: multipartUpload.parts,
            },
          }),
        );

        this.logger.debug(`Completed multipart upload for "${key}"`);

        delete this.multipartUploads[file.id];
      }
    } catch (error) {
      const multipartUpload = this.multipartUploads[file.id];

      if (multipartUpload) {
        try {
          await s3Instance.send(
            new AbortMultipartUploadCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: multipartUpload.uploadId,
            }),
          );

          this.logger.debug(`Aborted multipart upload for "${key}"`);
        } catch (abortError) {
          this.logger.error("Error aborting multipart upload", {
            abortError,
            key,
          });
        }
        delete this.multipartUploads[file.id];
      }

      this.logger.error("Error in multipart upload", {
        error,
        fileId: file.id,
        fileName: file.name,
        shareId,
        key,
        chunkIndex: chunk.index,
        bucket: bucketName,
      });
      throw new InternalServerErrorException(
        "Multipart upload failed. The upload has been aborted.",
      );
    }

    const isLastChunk = chunk.index == chunk.total - 1;

    if (isLastChunk) {
      try {
        const fileSize: number = await this.getFileSize(shareId, file.name);

        await this.prisma.file.create({
          data: {
            id: file.id,
            name: file.name,
            size: fileSize.toString(),
            share: { connect: { id: shareId } },
          },
        });

        this.logger.debug(
          `Created database record for file "${file.name}" with ID "${file.id}"`,
        );
      } catch (error) {
        this.logger.error("Error creating file record", {
          error,
          fileId: file.id,
          fileName: file.name,
          shareId,
        });
        throw new InternalServerErrorException(
          "Failed to create file record in database",
        );
      }
    }

    return file;
  }

  async get(shareId: string, fileId: string): Promise<File> {
    const fileName = (
      await this.prisma.file.findUnique({ where: { id: fileId } })
    ).name;

    const s3Instance = this.getS3Instance();
    const key = `${this.getS3Path()}${shareId}/${fileName}`;
    const response = await s3Instance.send(
      new GetObjectCommand({
        Bucket: this.config.get("s3.bucketName"),
        Key: key,
      }),
    );

    return {
      metaData: {
        id: fileId,
        size: response.ContentLength?.toString() || "0",
        name: fileName,
        shareId: shareId,
        createdAt: response.LastModified || new Date(),
        mimeType:
          mime.contentType(fileId.split(".").pop()) ||
          "application/octet-stream",
      },
      file: response.Body as Readable,
    } as File;
  }

  async remove(shareId: string, fileId: string) {
    const fileMetaData = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileMetaData) throw new NotFoundException("File not found");

    if (!shareId || shareId.includes("/")) {
      throw new BadRequestException("Invalid share ID format");
    }

    if (!fileMetaData.name || fileMetaData.name.includes("..")) {
      throw new BadRequestException("Invalid file name");
    }

    const key = `${this.getS3Path()}${shareId}/${fileMetaData.name}`;
    const bucketName = this.config.get("s3.bucketName");
    const s3Instance = this.getS3Instance();

    this.logger.debug(
      `Attempting to delete file "${key}" from bucket "${bucketName}"`,
    );

    try {
      await s3Instance.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      );

      this.logger.debug(
        `Successfully deleted file "${key}" from bucket "${bucketName}"`,
      );
    } catch (error) {
      this.logger.error("Error deleting file from S3", {
        error,
        shareId,
        fileId,
        fileName: fileMetaData.name,
        key,
        bucket: bucketName,
      });
      throw new InternalServerErrorException("Could not delete file from S3");
    }

    await this.prisma.file.delete({ where: { id: fileId } });
  }

  async deleteAllFiles(shareId: string) {
    const prefix = `${this.getS3Path()}${shareId}/`;
    const bucketName = this.config.get("s3.bucketName");
    const s3Instance = this.getS3Instance();

    this.logger.debug(
      `Attempting to delete files with prefix "${prefix}" from bucket "${bucketName}"`,
    );

    try {
      if (!shareId || shareId.includes("/")) {
        throw new BadRequestException("Invalid share ID format");
      }

      const listResponse = await s3Instance.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: prefix,
        }),
      );

      this.logger.debug(
        `ListObjectsV2Command response: Found ${listResponse.Contents?.length || 0} objects`,
        { prefix, keyCount: listResponse.KeyCount },
      );

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        this.logger.warn(
          `No files found for share ${shareId} with prefix "${prefix}"`,
        );

        try {
          const rootListResponse = await s3Instance.send(
            new ListObjectsV2Command({
              Bucket: bucketName,
              Delimiter: "/",
            }),
          );

          this.logger.debug(`Root level folders in bucket:`, {
            prefixes: rootListResponse.CommonPrefixes?.map((p) => p.Prefix),
            objects: rootListResponse.Contents?.map((c) => c.Key),
          });
        } catch (rootListError) {
          this.logger.error(`Error listing root level folders`, {
            error: rootListError,
          });
        }

        return;
      }

      const objectsToDelete = listResponse.Contents.map((file) => ({
        Key: file.Key!,
      }));

      this.logger.debug(`Deleting ${objectsToDelete.length} objects`, {
        firstFew: objectsToDelete.slice(0, 3).map((o) => o.Key),
      });

      await s3Instance.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: objectsToDelete,
          },
        }),
      );

      this.logger.debug(
        `Successfully deleted ${objectsToDelete.length} files for share ${shareId}`,
      );
    } catch (error) {
      this.logger.error("Error deleting all files from S3", {
        error,
        shareId,
        prefix,
        bucket: bucketName,
      });

      throw new InternalServerErrorException(
        "Could not delete all files from S3",
      );
    }
  }

  async getFileSize(shareId: string, fileName: string): Promise<number> {
    if (!shareId || shareId.includes("/")) {
      throw new BadRequestException("Invalid share ID format");
    }

    if (!fileName || fileName.includes("..")) {
      throw new BadRequestException("Invalid file name");
    }

    const key = `${this.getS3Path()}${shareId}/${fileName}`;
    const bucketName = this.config.get("s3.bucketName");
    const s3Instance = this.getS3Instance();

    try {
      const headObjectResponse = await s3Instance.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      );

      return headObjectResponse.ContentLength ?? 0;
    } catch (error) {
      this.logger.error("Error getting file size", {
        error,
        shareId,
        fileName,
        key,
        bucket: bucketName,
      });
      throw new InternalServerErrorException("Could not retrieve file size");
    }
  }

  getS3Instance(): S3Client {
    const checksumCalculation =
      this.config.get("s3.useChecksum") === true ? null : "WHEN_REQUIRED";

    return new S3Client({
      endpoint: this.config.get("s3.endpoint"),
      region: this.config.get("s3.region"),
      credentials: {
        accessKeyId: this.config.get("s3.key"),
        secretAccessKey: this.config.get("s3.secret"),
      },
      forcePathStyle: true,
      requestChecksumCalculation: checksumCalculation,
      responseChecksumValidation: checksumCalculation,
    });
  }

  getZip() {
    throw new BadRequestException(
      "ZIP download is not supported with S3 storage",
    );
  }

  getS3Path(): string {
    const configS3Path = this.config.get("s3.bucketPath");

    if (!configS3Path) return "";

    const cleanPath = configS3Path.replace(/^\/+|\/+$/g, "");
    return cleanPath ? `${cleanPath}/` : "";
  }
}
