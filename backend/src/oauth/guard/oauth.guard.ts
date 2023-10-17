import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;
    return request.query.state === request.cookies[`oauth_${provider}_state`];
  }
}
