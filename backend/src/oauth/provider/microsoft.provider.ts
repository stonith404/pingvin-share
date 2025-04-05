import { GenericOidcProvider, OidcToken } from "./genericOidc.provider";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { OAuthToken } from "./oauthProvider.interface";

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
    return `https://login.microsoftonline.com/${this.config.get(
      "oauth.microsoft-tenant",
    )}/v2.0/.well-known/openid-configuration`;
  }

  getUserInfo(
    token: OAuthToken<OidcToken>,
    query: OAuthCallbackDto,
    _?: string,
  ): Promise<OAuthSignInDto> {
    const claim = this.config.get("oauth.microsoft-usernameClaim") || undefined;
    const rolePath = "roles";
    const roleGeneralAccess =
      this.config.get("oauth.microsoft-roleGeneralAccess") || undefined;
    const roleAdminAccess =
      this.config.get("oauth.microsoft-roleAdminAccess") || undefined;
    return super.getUserInfo(token, query, claim, {
      path: rolePath,
      generalAccess: roleGeneralAccess,
      adminAccess: roleAdminAccess,
    });
  }
}
