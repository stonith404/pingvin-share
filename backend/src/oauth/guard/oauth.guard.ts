import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const provider = this.reflector.get<string>("oauthProvider", context.getHandler())
    const request = context.switchToHttp().getRequest();
    if (request.query.state !== request.cookies[`oauth_${provider}_state`]) {
      return false;
    }
    // TODO validate nonce
    return true;
  }
}
