import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { ConfigService } from "../../config/config.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import fetch from "node-fetch";

@Injectable()
export class DiscordProvider implements OAuthProvider<DiscordToken> {
  constructor(private config: ConfigService) {}

  getAuthEndpoint(state: string): Promise<string> {
    return Promise.resolve(
      "https://discord.com/api/oauth2/authorize?" +
        new URLSearchParams({
          client_id: this.config.get("oauth.discord-clientId"),
          redirect_uri:
            this.config.get("general.appUrl") + "/api/oauth/callback/discord",
          response_type: "code",
          state: state,
          scope: "identify email",
        }).toString(),
    );
  }

  private getAuthorizationHeader() {
    return (
      "Basic " +
      Buffer.from(
        this.config.get("oauth.discord-clientId") +
          ":" +
          this.config.get("oauth.discord-clientSecret"),
      ).toString("base64")
    );
  }

  async getToken(query: OAuthCallbackDto): Promise<OAuthToken<DiscordToken>> {
    const res = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: this.getAuthorizationHeader(),
      },
      body: new URLSearchParams({
        code: query.code,
        grant_type: "authorization_code",
        redirect_uri:
          this.config.get("general.appUrl") + "/api/oauth/callback/discord",
      }),
    });
    const token: DiscordToken = await res.json();
    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresIn: token.expires_in,
      scope: token.scope,
      tokenType: token.token_type,
      rawToken: token,
    };
  }

  async getUserInfo(token: OAuthToken<DiscordToken>): Promise<OAuthSignInDto> {
    const res = await fetch("https://discord.com/api/v10/user/@me", {
      method: "post",
      headers: {
        Accept: "application/json",
        Authorization: `${token.tokenType || "Bearer"} ${token.accessToken}`,
      },
    });
    const user = (await res.json()) as DiscordUser;
    if (user.verified === false) {
      throw new BadRequestException("Unverified account.");
    }

    return {
      provider: "discord",
      providerId: user.id,
      providerUsername: user.global_name ?? user.username,
      email: user.email,
    };
  }
}

export interface DiscordToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string;
  email: string;
  verified: boolean;
}
