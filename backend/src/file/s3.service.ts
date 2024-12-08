import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Logger} from '@nestjs/common';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand, DeleteObjectsCommand,
  GetObjectCommand, HeadObjectCommand, ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
  UploadPartCommandOutput
} from '@aws-sdk/client-s3';
import {PrismaService} from 'src/prisma/prisma.service';
import {ConfigService} from 'src/config/config.service';
import * as crypto from 'crypto';
import * as mime from 'mime-types';
import {File} from "./file.service";
import {Readable} from "stream";
import { validate as isValidUUID } from "uuid";

@Injectable()
export class S3FileService {
  private readonly logger = new Logger(S3FileService.name);

  private multipartUploads: Record<string, {
    uploadId: string;
    parts: Array<{ ETag: string | undefined; PartNumber: number }>
  }> = {};

  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    data: string,
    chunk: { index: number; total: number },
    file: { id?: string; name: string },
    shareId: string) {
    if (!file.id) {
      file.id = crypto.randomUUID();
    } else if (!isValidUUID(file.id)) {
      throw new BadRequestException("Invalid file ID format");
    }

    const buffer = Buffer.from(data, "base64");
    const key = `${this.getS3Path()}${shareId}/${file.name}`;
    const bucketName = this.config.get("s3.bucketName");
    const s3Instance = this.getS3Instance();

    try {
      // Initialize multipart upload if it's the first chunk
      if (chunk.index === 0) {
        const multipartInitResponse = await s3Instance.send(
          new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
          })
        );

        const uploadId = multipartInitResponse.UploadId;
        if (!uploadId) {
          throw new Error("Failed to initialize multipart upload.");
        }

        // Store the uploadId and parts list in memory
        this.multipartUploads[file.id] = {
          uploadId,
          parts: [],
        };
      }

      // Get the ongoing multipart upload
      const multipartUpload = this.multipartUploads[file.id];
      if (!multipartUpload) {
        throw new InternalServerErrorException("Multipart upload session not found.");
      }

      const uploadId = multipartUpload.uploadId;

      // Upload the current chunk
      const partNumber = chunk.index + 1; // Part numbers start from 1

      const uploadPartResponse: UploadPartCommandOutput = await s3Instance.send(
        new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: buffer,
        })
      );

      // Store the ETag and PartNumber for later completion
      multipartUpload.parts.push({
        ETag: uploadPartResponse.ETag,
        PartNumber: partNumber,
      });

      // Complete the multipart upload if it's the last chunk
      if (chunk.index === chunk.total - 1) {
        await s3Instance.send(
          new CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
              Parts: multipartUpload.parts,
            },
          })
        );

        // Remove the completed upload from memory
        delete this.multipartUploads[file.id];
      }
    } catch (error) {
      // Abort the multipart upload if it fails
      const multipartUpload = this.multipartUploads[file.id];
      if (multipartUpload) {
        try {
          await s3Instance.send(
            new AbortMultipartUploadCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: multipartUpload.uploadId,
            })
          );
        } catch (abortError) {
          console.error("Error aborting multipart upload:", abortError);
        }
        delete this.multipartUploads[file.id];
      }
      this.logger.error(error);
      throw new Error("Multipart upload failed. The upload has been aborted.");
    }

    const isLastChunk = chunk.index == chunk.total - 1;
    if (isLastChunk) {
      const fileSize: number = await this.getFileSize(shareId, file.name)

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

  async get(shareId: string, fileId: string): Promise<File> {

    const fileName = (
      await this.prisma.file.findUnique({ where: { id: fileId } })
    ).name;

    const s3Instance = this.getS3Instance();
    const key = `${this.getS3Path()}${shareId}/${fileName}`;
    const response = await s3Instance.send(new GetObjectCommand({
      Bucket: this.config.get('s3.bucketName'),
      Key: key,
    }));

    return {
      metaData: {
        id: fileId,
        size: response.ContentLength?.toString() || "0",
        name: fileName,
        shareId: shareId,
        createdAt: response.LastModified || new Date(),
        mimeType: mime.contentType(fileId.split('.').pop()) || "application/octet-stream",
      },
      file: response.Body as Readable,
    } as File;
  }

  async remove(shareId: string, fileId: string) {
    const fileMetaData = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileMetaData) throw new NotFoundException("File not found");

    const key = `${this.getS3Path()}${shareId}/${fileMetaData.name}`;
    const s3Instance = this.getS3Instance();

    try {
      await s3Instance.send(
        new DeleteObjectCommand({
          Bucket: this.config.get("s3.bucketName"),
          Key: key,
        })
      );
    } catch (error) {
      throw new Error("Could not delete file from S3");
    }

    await this.prisma.file.delete({ where: { id: fileId } });
  }

  async deleteAllFiles(shareId: string) {
    const prefix = `${this.getS3Path()}${shareId}/`;
    const s3Instance = this.getS3Instance();

    try {
      // List all objects under the given prefix
      const listResponse = await s3Instance.send(
        new ListObjectsV2Command({
          Bucket: this.config.get("s3.bucketName"),
          Prefix: prefix,
        })
      );

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        throw new Error(`No files found for share ${shareId}`);
      }

      // Extract the keys of the files to be deleted
      const objectsToDelete = listResponse.Contents.map((file) => ({
        Key: file.Key!,
      }));

      // Delete all files in a single request (up to 1000 objects at once)
      await s3Instance.send(
        new DeleteObjectsCommand({
          Bucket: this.config.get("s3.bucketName"),
          Delete: {
            Objects: objectsToDelete,
          },
        })
      );

    } catch (error) {
      throw new Error("Could not delete all files from S3");
    }
  }

  async getFileSize(shareId: string, fileName: string): Promise<number> {
    const key = `${this.getS3Path()}${shareId}/${fileName}`;
    const s3Instance = this.getS3Instance();

    try {
      // Get metadata of the file using HeadObjectCommand
      const headObjectResponse = await s3Instance.send(
        new HeadObjectCommand({
          Bucket: this.config.get('s3.bucketName'),
          Key: key,
        })
      );

      // Return ContentLength which is the file size in bytes
      return headObjectResponse.ContentLength ?? 0;
    } catch (error) {
      throw new Error('Could not retrieve file size');
    }
  }

  getS3Instance(): S3Client{
    return new S3Client({
      endpoint: this.config.get('s3.endpoint'),
      region: this.config.get('s3.region'),
      credentials: {
        accessKeyId: this.config.get('s3.key'),
        secretAccessKey: this.config.get('s3.secret'),
      },
      forcePathStyle: true,
    });
  }

  getZip() {
    throw new BadRequestException('ZIP download is not supported with S3 storage');
  }

  getS3Path(): string {
    const configS3Path = this.config.get("s3.bucketPath")
    return configS3Path ? `${configS3Path}/` : ""
  }
}
