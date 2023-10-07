import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { AuthModule } from "../auth/auth.module";
import { OAuthRequestService } from "./oauthRequest.service";
import { OidcService } from "./oidc.service";
import { ConfigService } from "../config/config.service";

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    OAuthRequestService,
    {
      provide: "OAUTH_PLATFORMS",
      useValue: ["oidc"],
    },

    {
      provide: "OIDC_NAME",
      useValue: "oidc",
    },
    {
      provide: "OIDC_DISCOVERY_URI",
      useFactory: (config: ConfigService) => config.get("oauth.oidc-discoveryUri"),
      inject: [ConfigService],
    },
    OidcService,
  ],
  imports: [AuthModule],
})
export class OAuthModule {
}
