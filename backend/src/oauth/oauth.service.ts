import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@prisma/client";
import { nanoid } from "nanoid";
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
  private readonly logger = new Logger(OAuthService.name);

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

  async signIn(user: OAuthSignInDto, ip: string) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        provider: user.provider,
        providerUserId: user.providerId,
      },
    });
    if (oauthUser) {
      await this.updateIsAdmin(user);
      const updatedUser = await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      this.logger.log(`Successful login for user ${user.email} from IP ${ip}`);
      return this.auth.generateToken(updatedUser, true);
    }

    return this.signUp(user, ip);
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

  private async getAvailableUsername(preferredUsername: string) {
    // only remove + and - from preferred username for now (maybe not enough)
    let username = preferredUsername.replace(/[+-]/g, "").substring(0, 20);
    while (true) {
      const user = await this.prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (user) {
        username = username + "_" + nanoid(10).replaceAll("-", "");
      } else {
        return username;
      }
    }
  }

  private async signUp(user: OAuthSignInDto, ip: string) {
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
      await this.updateIsAdmin(user);
      return this.auth.generateToken(existingUser, true);
    }

    const result = await this.auth.signUp(
      {
        email: user.email,
        username: await this.getAvailableUsername(user.providerUsername),
        password: null,
      },
      ip,
      user.isAdmin,
    );

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

  private async updateIsAdmin(user: OAuthSignInDto) {
    if ("isAdmin" in user)
      await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          isAdmin: user.isAdmin,
        },
      });
  }
}
