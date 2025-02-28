import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@prisma/client";
import { nanoid } from "nanoid";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";
import { OAuthSignInDto } from "./dto/oauthSignIn.dto";
import { ErrorPageException } from "./exceptions/errorPage.exception";
import { OAuthProvider } from "./provider/oauthProvider.interface";

@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    @Inject(forwardRef(() => AuthService)) private auth: AuthService,
    @Inject("OAUTH_PLATFORMS") private platforms: string[],
    @Inject("OAUTH_PROVIDERS")
    private oAuthProviders: Record<string, OAuthProvider<unknown>>,
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

  availableProviders(): Record<string, OAuthProvider<unknown>> {
    return Object.fromEntries(
      Object.entries(this.oAuthProviders)
        .map(([providerName, provider]) => [
          [providerName, provider],
          this.config.get(`oauth.${providerName}-enabled`),
        ])
        .filter(([_, enabled]) => enabled)
        .map(([provider, _]) => provider),
    );
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
      await this.updateIsAdmin(oauthUser.userId, user.isAdmin);
      const updatedUser = await this.prisma.user.findFirst({
        where: {
          id: oauthUser.userId,
        },
      });
      this.logger.log(`Successful login for user ${user.email} from IP ${ip}`);
      return this.auth.generateToken(updatedUser, { idToken: user.idToken });
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
    // Only keep letters, numbers, dots, and underscores. Truncate to 20 characters.
    let username = preferredUsername
      .replace(/[^a-zA-Z0-9._]/g, "")
      .substring(0, 20);
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
      await this.updateIsAdmin(existingUser.id, user.isAdmin);
      return this.auth.generateToken(existingUser, { idToken: user.idToken });
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

  private async updateIsAdmin(userId: string, isAdmin?: boolean) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isAdmin: isAdmin === true,
      },
    });
  }
}
