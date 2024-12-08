import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ReverseShareModule } from "src/reverseShare/reverseShare.module";
import { ShareModule } from "src/share/share.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import {LocalFileService} from "./local.service";
import {S3FileService} from "./s3.service";

@Module({
  imports: [JwtModule.register({}), ReverseShareModule, ShareModule],
  controllers: [FileController],
  providers: [FileService, LocalFileService, S3FileService],
  exports: [FileService],
})
export class FileModule {}
