import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import * as moment from "moment";
import { PrismaService } from "src/prisma/prisma.service";
import { ShareService } from "src/share/share.service";

@Injectable()
export class ShareSecurityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private shareService: ShareService,
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

    if (!share || moment().isAfter(share.expiration))
      throw new NotFoundException("Share not found");

    if (!share.security) return true;

    if (share.security.maxViews && share.security.maxViews <= share.views)
      throw new ForbiddenException(
        "Maximum views exceeded",
        "share_max_views_exceeded"
      );

    if (
      !this.shareService.verifyShareToken(shareId, request.get("X-Share-Token"))
    )
      throw new ForbiddenException(
        "This share is password protected",
        "share_token_required"
      );

    return true;
  }
}
