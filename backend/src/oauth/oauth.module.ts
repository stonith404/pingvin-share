import { Module } from "@nestjs/common";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";
import { AuthModule } from "../auth/auth.module";
import { GitHubProvider } from "./provider/github.provider";
import { GoogleProvider } from "./provider/google.provider";
import { OAuthProvider } from "./provider/oauthProvider.interface";
import { OidcProvider } from "./provider/oidc.provider";
import { DiscordProvider } from "./provider/discord.provider";
import { MicrosoftProvider } from "./provider/microsoft.provider";

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    GitHubProvider,
    GoogleProvider,
    MicrosoftProvider,
    DiscordProvider,
    OidcProvider,
    {
      provide: "OAUTH_PROVIDERS",
      useFactory(
        github: GitHubProvider,
        google: GoogleProvider,
        microsoft: MicrosoftProvider,
        discord: DiscordProvider,
        oidc: OidcProvider,
      ): Record<string, OAuthProvider<unknown>> {
        return {
          github,
          google,
          microsoft,
          discord,
          oidc,
        };
      },
      inject: [
        GitHubProvider,
        GoogleProvider,
        MicrosoftProvider,
        DiscordProvider,
        OidcProvider,
      ],
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
export class OAuthModule {}
