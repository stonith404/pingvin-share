import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import * as contentDisposition from "content-disposition";
import { Response } from "express";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { FileDownloadGuard } from "src/file/guard/fileDownload.guard";
import { ShareOwnerGuard } from "src/share/guard/shareOwner.guard";
import { ShareSecurityGuard } from "src/share/guard/shareSecurity.guard";
import { FileService } from "./file.service";

@Controller("shares/:shareId/files")
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @SkipThrottle()
  @UseGuards(JwtGuard, ShareOwnerGuard)
  async create(
    @Query() query: any,

    @Body() body: string,
    @Param("shareId") shareId: string
  ) {
    const { id, name, chunkIndex, totalChunks } = query;

    const data = body.toString().split(",")[1];

    return await this.fileService.create(
      data,
      { index: parseInt(chunkIndex), total: parseInt(totalChunks) },
      { id, name },
      shareId
    );
  }

  @Get(":fileId/download")
  @UseGuards(ShareSecurityGuard)
  async getFileDownloadUrl(
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string
  ) {
    const url = this.fileService.getFileDownloadUrl(shareId, fileId);

    return { url };
  }

  @Get("zip/download")
  @UseGuards(ShareSecurityGuard)
  async getZipArchiveDownloadURL(
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string
  ) {
    const url = this.fileService.getFileDownloadUrl(shareId, fileId);

    return { url };
  }

  @Get("zip")
  @UseGuards(FileDownloadGuard)
  async getZip(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string
  ) {
    const zip = this.fileService.getZip(shareId);
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment ; filename="pingvin-share-${shareId}.zip"`,
    });

    return new StreamableFile(zip);
  }

  @Get(":fileId")
  @UseGuards(FileDownloadGuard)
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string
  ) {
    const file = await this.fileService.get(shareId, fileId);
    res.set({
      "Content-Type": file.metaData.mimeType,
      "Content-Length": file.metaData.size,
      "Content-Disposition": contentDisposition(file.metaData.name),
    });

    return new StreamableFile(file.file);
  }
}
