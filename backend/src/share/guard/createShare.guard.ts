import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ConfigService } from "src/config/config.service";
import { ShareService } from "../share.service";

@Injectable()
export class CreateShareGuard extends JwtGuard {
  constructor(
    configService: ConfigService,
    private shareService: ShareService
  ) {
    super(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await super.canActivate(context)) return true;

    const reverseShareTokenId = context.switchToHttp().getRequest()
      .cookies.reverse_share_token;

    if (!reverseShareTokenId) return false;

    const isReverseShareTokenValid =
      await this.shareService.isReverseShareTokenValid(reverseShareTokenId);

    console.log(isReverseShareTokenValid);

    return isReverseShareTokenValid;
  }
}
