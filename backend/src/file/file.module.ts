import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ShareModule } from "src/share/share.module";
import { ShareService } from "src/share/share.service";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [JwtModule.register({}), ShareModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
