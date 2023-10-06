import fetch from "node-fetch";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable()
export class OAuthRequestService {
  constructor(private config: ConfigService) {
  }

  async getGitHubToken(code: string): Promise<GitHubToken> {
    const qs = new URLSearchParams();
    qs.append("client_id", this.config.get("oauth.github-clientId"));
    qs.append("client_secret", this.config.get("oauth.github-clientSecret"));
    qs.append("code", code);

    const res = await fetch("https://github.com/login/oauth/access_token?" + qs.toString(), {
      method: "post",
      headers: {
        "Accept": "application/json",
      }
    });
    return await res.json() as GitHubToken;
  }

  async getGitHubUser(token: GitHubToken): Promise<GitHubUser> {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `${token.token_type} ${token.access_token}`,
      }
    });
    return await res.json() as GitHubUser;
  }

  async getGitHubEmail(token: GitHubToken): Promise<string | undefined> {
    const res = await fetch("https://api.github.com/user/public_emails", {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `${token.token_type} ${token.access_token}`,
      }
    });
    const emails = await res.json() as GitHubEmail[];
    return emails.find(e => e.primary && e.verified)?.email;
  }
}


interface GitHubToken {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  login: string;
  id: number;
  name?: string;
  email?: string; // this filed seems only return null
}

interface GitHubEmail {
  email: string;
  primary: boolean,
  verified: boolean,
  visibility: string | null
}