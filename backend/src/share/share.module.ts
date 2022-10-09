import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { FileModule } from "src/file/file.module";
import { ShareController } from "./share.controller";
import { ShareService } from "./share.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [ShareController],
  providers: [ShareService],
  exports: [ShareService],
})
export class ShareModule {}
