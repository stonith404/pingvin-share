import {
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { FileDownloadGuard } from "src/file/guard/fileDownload.guard";
import { ShareDTO } from "src/share/dto/share.dto";
import { ShareSecurityGuard } from "src/share/guard/shareSecurity.guard";
import { FileService } from "./file.service";

@Controller("shares/:shareId/files")
export class FileController {
  constructor(
    private fileService: FileService,
    private config: ConfigService
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      dest: "./uploads/_temp/",
    })
  )
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: parseInt(process.env.MAX_FILE_SIZE),
        })
        .build()
    )
    file: Express.Multer.File,
    @Param("shareId") shareId: string
  ) {
    return new ShareDTO().from( await this.fileService.create(file, shareId));
  }

  @Get(":fileId/download")
  @UseGuards(ShareSecurityGuard)
  async getFileDownloadUrl(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string
  ) {
    const url = this.fileService.getFileDownloadUrl(shareId, fileId);

    return { url };
  }

  @Get("zip/download")
  @UseGuards(ShareSecurityGuard)
  async getZipArchiveDownloadURL(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string
  ) {
    const url = this.fileService.getFileDownloadUrl(shareId, fileId);

    res.set({
      "Content-Type": "application/zip",
    });

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
      "Content-Disposition": `attachment ; filename="pingvin-share-${shareId}"`,
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
      "Content-Disposition": `attachment ; filename="${file.metaData.name}"`,
    });

    return new StreamableFile(file.file);
  }
}
