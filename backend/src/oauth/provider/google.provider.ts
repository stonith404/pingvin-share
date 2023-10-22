import { GenericOidcProvider } from "./genericOidc.provider";
import { ConfigService } from "../../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GoogleProvider extends GenericOidcProvider {
  constructor(
    config: ConfigService,
    jwtService: JwtService,
    @Inject(CACHE_MANAGER) cache: Cache,
  ) {
    super("google", ["oauth.google-enabled"], config, jwtService, cache);
  }

  protected getDiscoveryUri(): string {
    return "https://accounts.google.com/.well-known/openid-configuration";
  }
}
