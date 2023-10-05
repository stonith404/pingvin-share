import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "../config/config.service";
import { AuthService } from "../auth/auth.service";
import { User } from "@prisma/client";
import { nanoid } from "nanoid";
import fetch from "node-fetch";


@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private auth: AuthService,
    @Inject("OAUTH_PLATFORMS") private platforms: string[],
  ) {
  }

  getAvailable(): string[] {
    return this.platforms
      .map(platform => [platform, this.config.get(`oauth.${platform}-enabled`)])
      .filter(([_, enabled]) => enabled)
      .map(([platform, _]) => platform);
  }

  private async getGitHubToken(code: string): Promise<GitHubToken> {
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

  private async getGitHubUser(token: GitHubToken): Promise<GitHubUser> {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `${token.token_type} ${token.access_token}`,
      }
    });
    return await res.json() as GitHubUser;
  }

  private async getGitHubEmails(token: GitHubToken): Promise<string | undefined> {
    const res = await fetch("https://api.github.com/user/public_emails", {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `${token.token_type} ${token.access_token}`,
      }
    });
    const emails = await res.json() as GitHubEmail[];
    return emails.find(e => e.primary && e.verified)?.email;
  }

  async signIn(user: OAuthSignInDto) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        provider: user.provider,
        providerUserId: user.providerId,
      },
      include: {
        user: true
      },
    });
    if (oauthUser) {
      return this.auth.generateToken(oauthUser.user, true);
    }

    return this.signUp(user);
  }

  private async signUp(user: OAuthSignInDto) {
    // register
    if (!this.config.get("oauth.allowRegistration")) {
      throw new UnauthorizedException("No such user");
    }

    if (!user.email) {
      throw new BadRequestException("No email found");
    }

    const existingUser: User = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      }
    });

    if (existingUser) {
      await this.prisma.oAuthUser.create({
        data: {
          provider: user.provider,
          providerUserId: user.providerId.toString(),
          providerUsername: user.providerUsername,
          userId: existingUser.id,
        },
      });
      return this.auth.generateToken(existingUser, true);
    }

    // TODO user registered by oauth will hava a random password and username
    const result = await this.auth.signUp({
      email: user.email,
      username: nanoid().replaceAll("-", ''),
      password: nanoid(),
    });

    await this.prisma.oAuthUser.create({
      data: {
        provider: user.provider,
        providerUserId: user.providerId.toString(),
        providerUsername: user.providerUsername,
        userId: result.user.id,
      },
    });

    return result;
  }

  async github(code: string) {
    const ghToken = await this.getGitHubToken(code);
    const ghUser = await this.getGitHubUser(ghToken);
    if (!ghToken.scope.includes("user:email")) {
      throw new BadRequestException("No email permission granted");
    }
    const email = await this.getGitHubEmails(ghToken);
    return this.signIn({
      provider: "github",
      providerId: ghUser.id.toString(),
      providerUsername: ghUser.login,
      email,
    });
  }

  async status(user: User) {
    const oauthUsers = await this.prisma.oAuthUser.findMany({
      select: {
        provider: true,
        providerUsername: true,
      },
      where: {
        userId: user.id,
      },
    });
    return Object.fromEntries(oauthUsers.map(u => [u.provider, u]));
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