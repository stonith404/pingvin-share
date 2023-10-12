import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "../config/config.service";
import { AuthService } from "../auth/auth.service";
import { User } from "@prisma/client";
import { nanoid } from "nanoid";
import { OAuthSignInDto } from "./dto/oauthSignIn.dto";


@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private auth: AuthService,
    @Inject("OAUTH_PLATFORMS") private platforms: string[],
  ) {
  }

  available(): string[] {
    return this.platforms
      .map(platform => [platform, this.config.get(`oauth.${platform}-enabled`)])
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
    return Object.fromEntries(oauthUsers.map(u => [u.provider, u]));
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

  async link(userId: string, provider: string, providerUserId: string, providerUsername: string) {
    const oauthUser = await this.prisma.oAuthUser.findFirst({
      where: {
        provider,
        providerUserId,
      }
    });
    if (oauthUser) {
      throw new BadRequestException(`This ${provider} account has been linked to another account`);
    }

    await this.prisma.oAuthUser.create({
      data: {
        userId,
        provider,
        providerUsername,
        providerUserId,
      }
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
      throw new BadRequestException(`You have not linked your account to ${provider} yet.`);
    }
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
