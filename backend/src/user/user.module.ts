import { Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { UserController } from "./user.controller";
import { UserSevice } from "./user.service";
import { FileModule } from "src/file/file.module";

@Module({
  imports: [EmailModule, FileModule],
  providers: [UserSevice],
  controllers: [UserController],
})
export class UserModule {}
