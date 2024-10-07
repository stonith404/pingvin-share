import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { ErrorPageException } from "../exceptions/errorPage.exception";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";

@Injectable()
export class GitHubProvider implements OAuthProvider<GitHubToken> {
  constructor(private config: ConfigService) {}

  getAuthEndpoint(state: string): Promise<string> {
    return Promise.resolve(
      "https://github.com/login/oauth/authorize?" +
        new URLSearchParams({
          client_id: this.config.get("oauth.github-clientId"),
          redirect_uri:
            this.config.get("general.appUrl") + "/api/oauth/callback/github",
          state: state,
          scope: "user:email",
        }).toString(),
    );
  }

  async getToken(query: OAuthCallbackDto): Promise<OAuthToken<GitHubToken>> {
    const res = await fetch(
      "https://github.com/login/oauth/access_token?" +
        new URLSearchParams({
          client_id: this.config.get("oauth.github-clientId"),
          client_secret: this.config.get("oauth.github-clientSecret"),
          code: query.code,
        }).toString(),
      {
        method: "post",
        headers: {
          Accept: "application/json",
        },
      },
    );
    const token = (await res.json()) as GitHubToken;
    return {
      accessToken: token.access_token,
      tokenType: token.token_type,
      scope: token.scope,
      rawToken: token,
    };
  }

  async getUserInfo(token: OAuthToken<GitHubToken>): Promise<OAuthSignInDto> {
    if (!token.scope.includes("user:email")) {
      throw new ErrorPageException("no_email", undefined, ["provider_github"]);
    }
    const user = await this.getGitHubUser(token);
    const email = await this.getGitHubEmail(token);
    if (!email) {
      throw new ErrorPageException("no_email", undefined, ["provider_github"]);
    }

    return {
      provider: "github",
      providerId: user.id.toString(),
      providerUsername: user.name ?? user.login,
      email,
      idToken: `github:${token.idToken}`,
    };
  }

  private async getGitHubUser(
    token: OAuthToken<GitHubToken>,
  ): Promise<GitHubUser> {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `${token.tokenType ?? "Bearer"} ${token.accessToken}`,
      },
    });
    return (await res.json()) as GitHubUser;
  }

  private async getGitHubEmail(
    token: OAuthToken<GitHubToken>,
  ): Promise<string | undefined> {
    const res = await fetch("https://api.github.com/user/public_emails", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `${token.tokenType ?? "Bearer"} ${token.accessToken}`,
      },
    });
    const emails = (await res.json()) as GitHubEmail[];
    return emails.find((e) => e.primary && e.verified)?.email;
  }
}

export interface GitHubToken {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  name?: string;
  email?: string; // this filed seems only return null
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
