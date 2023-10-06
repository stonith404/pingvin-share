import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { GoogleStrategy } from "./strategy/google.strategy";
import { OAuthRequestService } from "./oauthRequest.service";

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    OAuthRequestService,
    GoogleStrategy,
    {
      provide: "OAUTH_PLATFORMS",
      useValue: ["github", "google"],
    },
  ],
  imports: [AuthModule],
})
export class OAuthModule {
}
