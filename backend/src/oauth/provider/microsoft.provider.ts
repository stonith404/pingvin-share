import { GenericOidcProvider } from "./genericOidc.provider";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class MicrosoftProvider extends GenericOidcProvider {

  constructor(
    config: ConfigService,
    jwtService: JwtService,
    @Inject(CACHE_MANAGER) cache: Cache,
  ) {
    super(
      "microsoft",
      ["oauth.microsoft-enabled", "oauth.microsoft-tenant"],
      config,
      jwtService,
      cache,
    );
  }

  protected getDiscoveryUri(): string {
    return `https://login.microsoftonline.com/${this.config.get("oauth.microsoft-tenant")}/v2.0/.well-known/openid-configuration`;
  }
}