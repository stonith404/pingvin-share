import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { ShareService } from "src/share/share.service";

@Injectable()
export class ShareOwnerGuard implements CanActivate {
  constructor(
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const shareId = Object.prototype.hasOwnProperty.call(
      request.params,
      "shareId"
    )
      ? request.params.shareId
      : request.params.id;

    const share = await this.prisma.share.findUnique({
      where: { id: shareId },
      include: { security: true },
    });



    return share.creatorId == (request.user as User).id;
  }
}
