import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import * as moment from "moment";
import { PrismaService } from "src/prisma/prisma.service";
import { ShareService } from "src/share/share.service";

@Injectable()
export class ShareSecurityGuard implements CanActivate {
  constructor(
    private shareService: ShareService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const shareId = Object.prototype.hasOwnProperty.call(
      request.params,
      "shareId",
    )
      ? request.params.shareId
      : request.params.id;

    const shareToken = request.cookies[`share_${shareId}_token`];

    const share = await this.prisma.share.findUnique({
      where: { id: shareId },
      include: { security: true },
    });

    if (
      !share ||
      (moment().isAfter(share.expiration) &&
        !moment(share.expiration).isSame(0))
    )
      throw new NotFoundException("Share not found");

    if (share.security?.password && !shareToken)
      throw new ForbiddenException(
        "This share is password protected",
        "share_password_required",
      );

    if (!(await this.shareService.verifyShareToken(shareId, shareToken)))
      throw new ForbiddenException(
        "Share token required",
        "share_token_required",
      );

    return true;
  }
}
