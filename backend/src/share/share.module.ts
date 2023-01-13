import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClamscanModule } from "src/clamscan/clamscan.module";
import { EmailModule } from "src/email/email.module";
import { FileModule } from "src/file/file.module";
import { ShareController } from "./share.controller";
import { ShareService } from "./share.service";

@Module({
  imports: [
    JwtModule.register({}),
    EmailModule,
    ClamscanModule,
    forwardRef(() => FileModule),
  ],
  controllers: [ShareController],
  providers: [ShareService],
  exports: [ShareService],
})
export class ShareModule {}
