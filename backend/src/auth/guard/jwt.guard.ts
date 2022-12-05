import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private config: ConfigService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch {
      return this.config.get("ALLOW_UNAUTHENTICATED_SHARES");
    }
  }
}
