import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand, HeadObjectCommand,
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

@Injectable()
export class S3FileService {
  private s3: S3Client;
  private multipartUploads: Record<string, {
    uploadId: string;
    parts: Array<{ ETag: string | undefined; PartNumber: number }>
  }> = {};

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.s3 = new S3Client({
      endpoint: config.get('s3.endpoint'),
      region: config.get('s3.region'),
      credentials: {
        accessKeyId: config.get('s3.key'),
        secretAccessKey: config.get('s3.secret'),
      },
      forcePathStyle: true,
    });
  }

  async create(data: string, chunk: { index: number; total: number }, file: {
    id?: string;
    name: string
  }, shareId: string) {
    if (!file.id) {
      file.id = crypto.randomUUID();
    }

    const buffer = Buffer.from(data, "base64");
    const key = `${this.getS3Path()}${shareId}/${file.name}`;
    const bucketName = this.config.get("s3.bucketName");

    try {
      // Initialize multipart upload if it's the first chunk
      if (chunk.index === 0) {
        console.log(`Initializing multipart upload for file: ${file.name}`);

        const multipartInitResponse = await this.s3.send(
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

        console.log(`Multipart upload initialized with UploadId: ${uploadId}`);
      }

      // Get the ongoing multipart upload
      const multipartUpload = this.multipartUploads[file.id];
      if (!multipartUpload) {
        throw new InternalServerErrorException("Multipart upload session not found.");
      }

      const uploadId = multipartUpload.uploadId;

      // Upload the current chunk
      const partNumber = chunk.index + 1; // Part numbers start from 1
      console.log(`Uploading part ${partNumber} of file: ${file.name}`);

      const uploadPartResponse: UploadPartCommandOutput = await this.s3.send(
        new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: buffer,
        })
      );

      console.log(`Part ${partNumber} uploaded. ETag: ${uploadPartResponse.ETag}`);

      // Store the ETag and PartNumber for later completion
      multipartUpload.parts.push({
        ETag: uploadPartResponse.ETag,
        PartNumber: partNumber,
      });

      // Complete the multipart upload if it's the last chunk
      if (chunk.index === chunk.total - 1) {
        console.log(`Completing multipart upload for file: ${file.name}`);

        await this.s3.send(
          new CompleteMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
              Parts: multipartUpload.parts,
            },
          })
        );

        console.log(`Multipart upload completed for file: ${file.name}`);

        // Remove the completed upload from memory
        delete this.multipartUploads[file.id];
      }
    } catch (error) {
      console.error("Error during multipart upload process:", error);

      // Abort the multipart upload if it fails
      const multipartUpload = this.multipartUploads[file.id];
      if (multipartUpload) {
        try {
          await this.s3.send(
            new AbortMultipartUploadCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: multipartUpload.uploadId,
            })
          );
          console.log(`Multipart upload aborted for file: ${file.name}`);
        } catch (abortError) {
          console.error("Error aborting multipart upload:", abortError);
        }
        delete this.multipartUploads[file.id];
      }

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

    const key = `${this.getS3Path()}${shareId}/${fileName}`;
    const response = await this.s3.send(new GetObjectCommand({
      Bucket: this.config.get('s3.bucketName'),
      Key: key,
    }));

    return {
      metaData: {
        id: fileId,
        size: response.ContentLength?.toString() || "0",  // Use actual file size from response, fallback to "0"
        name: fileName,  // Use the file name or a placeholder if necessary
        shareId: shareId,
        createdAt: response.LastModified || new Date(),  // Use S3's last modified time or fallback to current time
        mimeType: mime.contentType(fileId.split('.').pop()) || "application/octet-stream",  // Default to octet-stream if unknown
      },
      file: response.Body as Readable,  // The file content from S3 or other sources
    } as File;
  }

  async remove(shareId: string, fileId: string) {
    await this.s3.send(new DeleteObjectCommand({
      Bucket: this.config.get('s3.bucketName'),
      Key: `${shareId}/${fileId}`,
    }));
  }

  async deleteAllFiles(shareId: string): Promise<string> {
    // Implement bulk delete if required
    return 'Delete all files is pending implementation';
  }

  async getFileSize(shareId: string, fileName: string): Promise<number> {
    const key = `${this.getS3Path()}${shareId}/${fileName}`;

    try {
      // Get metadata of the file using HeadObjectCommand
      const headObjectResponse = await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.config.get('s3.bucketName'),
          Key: key,
        })
      );

      // Return ContentLength which is the file size in bytes
      return headObjectResponse.ContentLength ?? 0;
    } catch (error) {
      console.error(`Failed to get file size for ${key}:`, error);
      throw new Error('Could not retrieve file size');
    }
  }

  getZip() {
    throw new BadRequestException('ZIP download is not supported with S3 storage');
  }

  getS3Path(): string {
    const configS3Path = this.config.get("s3.bucketPath")
    return configS3Path ? `${configS3Path}/` : ""
  }
}
