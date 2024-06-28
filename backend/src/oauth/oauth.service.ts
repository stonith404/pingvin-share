import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";
import { OAuthSignInDto } from "./dto/oauthSignIn.dto";
import { ErrorPageException } from "./exceptions/errorPage.exception";

@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private auth: AuthService,
    @Inject("OAUTH_PLATFORMS") private platforms: string[],
  ) {}

  available(): string[] {
    return this.platforms
      .map((platform) => [
        platform,
        this.config.get(`oauth.${platform}-enabled`),
      ])
      .filter(([_, enabled]) => enabled)
      .map(([platform, _]) => platform);
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
    return Object.fromEntries(oauthUsers.map((u) => [u.provider, u]));
  }

  async signIn(user: OAuthSignInDto) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        provider: user.provider,
        providerUserId: user.providerId,
      },
      include: {
        user: true,
      },
    });
    if (oauthUser) {
      return this.auth.generateToken(oauthUser.user, true);
    }

    return this.signUp(user);
  }

  async link(
    userId: string,
    provider: string,
    providerUserId: string,
    providerUsername: string,
  ) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        provider,
        providerUserId,
      },
    });
    if (oauthUser) {
      throw new ErrorPageException("already_linked", "/account", [
        `provider_${provider}`,
      ]);
    }

    await this.prisma.oAuthUser.create({
      data: {
        userId,
        provider,
        providerUsername,
        providerUserId,
      },
    });
  }

  async unlink(user: User, provider: string) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        userId: user.id,
        provider,
      },
    });
    if (oauthUser) {
      await this.prisma.oAuthUser.delete({
        where: {
          id: oauthUser.id,
        },
      });
    } else {
      throw new ErrorPageException("not_linked", "/account", [provider]);
    }
  }

  private async signUp(user: OAuthSignInDto) {
    // register
    if (!this.config.get("oauth.allowRegistration")) {
      throw new ErrorPageException("no_user", "/auth/signIn", [
        `provider_${user.provider}`,
      ]);
    }

    if (!user.email) {
      throw new ErrorPageException("no_email", "/auth/signIn", [
        `provider_${user.provider}`,
      ]);
    }

    const existingUser: User = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
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

    const result = await this.auth.signUp({
      email: user.email,
      username: user.providerUsername,
      password: null,
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
}
