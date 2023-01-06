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
import * as contentDisposition from "content-disposition";
import { Response } from "express";
import * as fs from "fs";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { FileDownloadGuard } from "src/file/guard/fileDownload.guard";
import { ShareOwnerGuard } from "src/share/guard/shareOwner.guard";
import { ShareSecurityGuard } from "src/share/guard/shareSecurity.guard";
import { FileService } from "./file.service";

@Controller("shares/:shareId/files")
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseGuards(JwtGuard, ShareOwnerGuard)
  async create(
    @Query() query: any,

    @Body() body: any,
    @Param("shareId") shareId: string
  ) {
    // Fixes file names with special characters
    // file.originalname = Buffer.from(file.originalname, "latin1").toString(
    //   "utf8"
    // );

    const { name, currentChunkIndex, totalChunks } = query;
    const firstChunk = parseInt(currentChunkIndex) === 0;
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
    const ext = name.split(".").pop();
    const data = body.toString().split(",")[1];
    const buffer = Buffer.from(data, "base64");

    const tmpFilename = "tmp_" + "test_file" + ext;

    if (firstChunk && fs.existsSync("./data/uploads/" + tmpFilename)) {
      fs.unlinkSync("./data/uploads/" + tmpFilename);
    }

    fs.appendFileSync("./data/uploads/" + tmpFilename, buffer);

    if (lastChunk) {
      const finalFilename = "final." + ext;
      fs.renameSync(
        "./data/uploads/" + tmpFilename,
        "./data/uploads/" + finalFilename
      );
      // return new ShareDTO().from(await this.fileService.create(file, shareId));
    }
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
