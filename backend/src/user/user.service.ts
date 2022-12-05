import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UserDTO } from "./dto/user.dto";

@Injectable()
export class UserSevice {
  constructor(private prisma: PrismaService) {}

  async list() {
    return await this.prisma.user.findMany();
  }

  async get(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: UserDTO) {
    const hash = await argon.hash(dto.password);
    try {
      return await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`
          );
        }
      }
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      const hash = user.password && (await argon.hash(user.password));

      return await this.prisma.user.update({
        where: { id },
        data: { ...user, password: hash },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`
          );
        }
      }
    }
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
