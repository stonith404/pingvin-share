import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReverseShareOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { reverseShareId } = request.params;

    const reverseShare = await this.prisma.reverseShare.findUnique({
      where: { id: reverseShareId },
    });

    if (!reverseShare) return false;

    return reverseShare.creatorId == (request.user as User).id;
  }
}
