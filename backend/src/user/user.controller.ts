import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { AdministratorGuard } from "src/auth/guard/isAdmin.guard";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UserDTO } from "./dto/user.dto";
import { UserSevice } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserSevice) {}

  // Own user operations
  @Get("me")
  @UseGuards(JwtGuard)
  async getCurrentUser(@GetUser() user: User) {
    return new UserDTO().from(user);
  }

  @Patch("me")
  @UseGuards(JwtGuard)
  async updateCurrentUser(@GetUser() user: User, @Body() data: UpdateUserDto) {
    return new UserDTO().from(await this.userService.update(user.id, data));
  }

  @Delete("me")
  @UseGuards(JwtGuard)
  async deleteCurrentUser(@GetUser() user: User) {
    return new UserDTO().from(await this.userService.delete(user.id));
  }

  // Global user operations
  @Get()
  @UseGuards(JwtGuard, AdministratorGuard)
  async list() {
    return new UserDTO().fromList(await this.userService.list());
  }

  @Post()
  @UseGuards(JwtGuard, AdministratorGuard)
  async create(@Body() user: UserDTO) {
    return new UserDTO().from(await this.userService.create(user));
  }

  @Patch(":id")
  @UseGuards(JwtGuard, AdministratorGuard)
  async update(@Param("id") id: string, @Body() user: UpdateUserDto) {
    return new UserDTO().from(await this.userService.update(id, user));
  }

  @Delete(":id")
  @UseGuards(JwtGuard, AdministratorGuard)
  async delete(@Param() id: string) {
    return new UserDTO().from(await this.userService.delete(id));
  }
}
