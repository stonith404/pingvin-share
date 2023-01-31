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
import { CreateShareGuard } from "src/share/guard/createShare.guard";
import { ShareOwnerGuard } from "src/share/guard/shareOwner.guard";
import { ShareSecurityGuard } from "src/share/guard/shareSecurity.guard";
import { FileService } from "./file.service";

@Controller("shares/:shareId/files")
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @SkipThrottle()
  @UseGuards(CreateShareGuard, ShareOwnerGuard)
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

  @Get("zip")
  @UseGuards(ShareSecurityGuard)
  async getZip(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string
  ) {
    const zip = this.fileService.getZip(shareId);
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": contentDisposition(`pingvin-share-${shareId}.zip`),
    });

    return new StreamableFile(zip);
  }

  @Get(":fileId")
  @UseGuards(ShareSecurityGuard)
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string,
    @Query("download") download = "true"
  ) {
    const file = await this.fileService.get(shareId, fileId);

    const headers = {
      "Content-Type": file.metaData.mimeType,
      "Content-Length": file.metaData.size,
    };

    if (download === "true") {
      headers["Content-Disposition"] = contentDisposition(file.metaData.name);
    }

    res.set(headers);

    return new StreamableFile(file.file);
  }
}
