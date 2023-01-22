import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CreateShareGuard extends JwtGuard {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await super.canActivate(context)) return true;

    const reverseShareTokenId = context.switchToHttp().getRequest()
      .cookies.reverse_share_token;

    if (!reverseShareTokenId) return false;

    const reverseShareToken = await this.prisma.reverseShareToken.findUnique({
      where: { id: reverseShareTokenId },
    });

    if (!reverseShareToken || new Date() > reverseShareToken.expiration)
      return false;

    return true;
  }
}
