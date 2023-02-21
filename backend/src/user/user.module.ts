import { Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { UserController } from "./user.controller";
import { UserSevice } from "./user.service";

@Module({
  imports:[EmailModule],
  providers: [UserSevice],
  controllers: [UserController],
})
export class UserModule {}
