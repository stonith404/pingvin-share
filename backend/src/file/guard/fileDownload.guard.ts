import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { FileService } from "src/file/file.service";

@Injectable()
export class FileDownloadGuard implements CanActivate {
  constructor(private fileService: FileService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.query.token as string;
    const { shareId } = request.params;

    return this.fileService.verifyFileDownloadToken(shareId, token);
  }
}
