import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class ProviderGuard implements CanActivate {
  constructor(private config: ConfigService,
              @Inject("OAUTH_PLATFORMS") private platforms: string[]) {
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;
    return this.platforms.includes(provider) && this.config.get(`oauth.${provider}-enabled`);
  }
}
