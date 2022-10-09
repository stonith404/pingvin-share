import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FileDownloadGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private fileService: FileService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.query.token as string;
    const { shareId, fileId } = request.params;

    return this.fileService.verifyFileDownloadToken(shareId, fileId, token);
  }
}
