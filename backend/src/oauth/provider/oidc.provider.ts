import { GenericOidcProvider } from "./genericOidc.provider";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class OidcProvider extends GenericOidcProvider {
  constructor(config: ConfigService,
              jwtService: JwtService,
              @Inject(CACHE_MANAGER) protected cache: Cache) {
    super(
      "oidc",
      config.get("oauth.oidc-discoveryUri"),
      ["oauth.oidc-enabled", "oauth.oidc-discoveryUri"],
      config,
      jwtService,
      cache,
    );
  }

}