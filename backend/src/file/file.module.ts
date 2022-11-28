import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ShareModule } from "src/share/share.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { FileValidationPipe } from "./pipe/fileValidation.pipe";

@Module({
  imports: [JwtModule.register({}), ShareModule],
  controllers: [FileController],
  providers: [FileService, FileValidationPipe],
  exports: [FileService],
})
export class FileModule {}
