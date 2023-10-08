import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private config: ConfigService,
  ) {
  }

  canActivate(context: ExecutionContext): boolean {
    const oauth = this.reflector.get<{
      provider: string;
      type: "endpoint" | "callback";
    }>("oauth", context.getHandler())
    if (oauth.type === "callback") {
      const request = context.switchToHttp().getRequest();
      return request.query.state === request.cookies[`oauth_${oauth.provider}_state`];
    } else {
      return this.config.get(`oauth.${oauth.provider}-enabled`)
    }
  }
}
