import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtGuard } from "src/auth/guard/jwt.guard";

@Controller("users")
export class UserController {
  @Get("me")
  @UseGuards(JwtGuard)
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }
}
