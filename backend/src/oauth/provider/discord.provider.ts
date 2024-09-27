import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { ErrorPageException } from "../exceptions/errorPage.exception";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";
@Injectable()
export class DiscordProvider implements OAuthProvider<DiscordToken> {
  constructor(private config: ConfigService) {}

  getAuthEndpoint(state: string): Promise<string> {
    let scope = "identify email";
    if (this.config.get("oauth.discord-limitedGuild")) {
      scope += " guilds";
    }
    return Promise.resolve(
      "https://discord.com/api/oauth2/authorize?" +
        new URLSearchParams({
          client_id: this.config.get("oauth.discord-clientId"),
          redirect_uri:
            this.config.get("general.appUrl") + "/api/oauth/callback/discord",
          response_type: "code",
          state,
          scope,
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
    const token = (await res.json()) as DiscordToken;
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
    const res = await fetch("https://discord.com/api/v10/users/@me", {
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: `${token.tokenType || "Bearer"} ${token.accessToken}`,
      },
    });
    const user = (await res.json()) as DiscordUser;
    if (user.verified === false) {
      throw new ErrorPageException("unverified_account", undefined, [
        "provider_discord",
      ]);
    }

    const guild = this.config.get("oauth.discord-limitedGuild");
    if (guild) {
      await this.checkLimitedGuild(token, guild);
    }
    const limitedusers = this.config.get("oauth.discord-limitedUsers");
    if (limitedusers) {
      await this.checkLimitedUsers(user, limitedusers);
    }
   
    return {
      provider: "discord",
      providerId: user.id,
      providerUsername: user.global_name ?? user.username,
      email: user.email,
    };
  }

  async checkLimitedGuild(token: OAuthToken<DiscordToken>, guildId: string) {
    try {
      const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        method: "get",
        headers: {
          Accept: "application/json",
          Authorization: `${token.tokenType || "Bearer"} ${token.accessToken}`,
        },
      });
      const guilds = (await res.json()) as DiscordPartialGuild[];
      if (!guilds.some((guild) => guild.id === guildId)) {
        throw new ErrorPageException("user_not_allowed");
      }
    } catch {
      throw new ErrorPageException("user_not_allowed");
    }
  }

  async checkLimitedUsers(user: DiscordUser, userIds: string) {
    if (!userIds.split(",").includes(user.id)) {
      throw new ErrorPageException("user_not_allowed");
    }
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

export interface DiscordPartialGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}
