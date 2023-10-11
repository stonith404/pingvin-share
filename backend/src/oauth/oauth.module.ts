import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { AuthModule } from "../auth/auth.module";
import { GitHubProvider } from "./provider/github.provider";
import { GoogleProvider } from "./provider/google.provider";
import { OAuthProvider } from "./provider/oauthProvider.interface";
import { OidcProvider } from "./provider/oidc.provider";

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    GitHubProvider,
    GoogleProvider,
    OidcProvider,
    {
      provide: "OAUTH_PROVIDERS",
      useFactory(github: GitHubProvider, google: GoogleProvider, oidc: OidcProvider): Record<string, OAuthProvider<unknown>> {
        return {
          github,
          google,
          oidc,
        };
      },
      inject: [GitHubProvider, GoogleProvider, OidcProvider],
    },
    {
      provide: "OAUTH_PLATFORMS",
      useFactory(providers: Record<string, OAuthProvider<unknown>>): string[] {
        return Object.keys(providers);
      },
      inject: ["OAUTH_PROVIDERS"],
    },
  ],
  imports: [AuthModule],
})
export class OAuthModule {
}
