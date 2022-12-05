import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserSevice } from "./user.service";

@Module({
  providers: [UserSevice],
  controllers: [UserController],
})
export class UserModule {}
