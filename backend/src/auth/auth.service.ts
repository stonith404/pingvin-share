import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";
import { Request, Response } from "express";
import * as moment from "moment";
import { ConfigService } from "src/config/config.service";
import { EmailService } from "src/email/email.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signUp(dto: AuthRegisterDTO, ip: string) {
    const isFirstUser = (await this.prisma.user.count()) == 0;

    const hash = dto.password ? await argon.hash(dto.password) : null;
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          isAdmin: isFirstUser,
        },
      });

      const { refreshToken, refreshTokenId } = await this.createRefreshToken(
        user.id,
      );
      const accessToken = await this.createAccessToken(user, refreshTokenId);

      this.logger.log(`User ${user.email} signed up from IP ${ip}`);
      return { accessToken, refreshToken, user };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`,
          );
        }
      }
    }
  }

  async signIn(dto: AuthSignInDTO, ip: string) {
    if (!dto.email && !dto.username)
      throw new BadRequestException("Email or username is required");

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      this.logger.log(
        `Failed login attempt for user ${dto.email} from IP ${ip}`,
      );
      throw new UnauthorizedException("Wrong email or password");
    }

    this.logger.log(`Successful login for user ${dto.email} from IP ${ip}`);
    return this.generateToken(user);
  }

  async generateToken(user: User, isOAuth = false) {
    // TODO: Make all old loginTokens invalid when a new one is created
    // Check if the user has TOTP enabled
    if (
      user.totpVerified &&
      !(isOAuth && this.config.get("oauth.ignoreTotp"))
    ) {
      const loginToken = await this.createLoginToken(user.id);

      return { loginToken };
    }

    const { refreshToken, refreshTokenId } = await this.createRefreshToken(
      user.id,
    );
    const accessToken = await this.createAccessToken(user, refreshTokenId);

    return { accessToken, refreshToken };
  }

  async requestResetPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { resetPasswordToken: true },
    });

    if (!user) return;

    // Delete old reset password token
    if (user.resetPasswordToken) {
      await this.prisma.resetPasswordToken.delete({
        where: { token: user.resetPasswordToken.token },
      });
    }

    const { token } = await this.prisma.resetPasswordToken.create({
      data: {
        expiresAt: moment().add(1, "hour").toDate(),
        user: { connect: { id: user.id } },
      },
    });

    await this.emailService.sendResetPasswordEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: { token } },
    });

    if (!user) throw new BadRequestException("Token invalid or expired");

    const newPasswordHash = await argon.hash(newPassword);

    await this.prisma.resetPasswordToken.delete({
      where: { token },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: newPasswordHash },
    });
  }

  async updatePassword(user: User, newPassword: string, oldPassword?: string) {
    const isPasswordValid =
      !user.password || (await argon.verify(user.password, oldPassword));

    if (!isPasswordValid) throw new ForbiddenException("Invalid password");

    const hash = await argon.hash(newPassword);

    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    return this.createRefreshToken(user.id);
  }

  async createAccessToken(user: User, refreshTokenId: string) {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        refreshTokenId,
      },
      {
        expiresIn: "15min",
        secret: this.config.get("internal.jwtSecret"),
      },
    );
  }

  async signOut(accessToken: string) {
    const { refreshTokenId } =
      (this.jwtService.decode(accessToken) as {
        refreshTokenId: string;
      }) || {};

    if (refreshTokenId) {
      await this.prisma.refreshToken
        .delete({ where: { id: refreshTokenId } })
        .catch((e) => {
          // Ignore error if refresh token doesn't exist
          if (e.code != "P2025") throw e;
        });
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const refreshTokenMetaData = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!refreshTokenMetaData || refreshTokenMetaData.expiresAt < new Date())
      throw new UnauthorizedException();

    return this.createAccessToken(
      refreshTokenMetaData.user,
      refreshTokenMetaData.id,
    );
  }

  async createRefreshToken(userId: string) {
    const { id, token } = await this.prisma.refreshToken.create({
      data: {
        userId,
        expiresAt: moment()
          .add(this.config.get("general.sessionDuration"), "hours")
          .toDate(),
      },
    });

    return { refreshTokenId: id, refreshToken: token };
  }

  async createLoginToken(userId: string) {
    const loginToken = (
      await this.prisma.loginToken.create({
        data: { userId, expiresAt: moment().add(5, "minutes").toDate() },
      })
    ).token;

    return loginToken;
  }

  addTokensToResponse(
    response: Response,
    refreshToken?: string,
    accessToken?: string,
  ) {
    if (accessToken)
      response.cookie("access_token", accessToken, {
        sameSite: "lax",
        maxAge: 1000 * 60 * 15, // 15 minutes
      });
    if (refreshToken)
      response.cookie("refresh_token", refreshToken, {
        path: "/api/auth/token",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * this.config.get("general.sessionDuration"),
      });
  }

  /**
   * Returns the user id if the user is logged in, null otherwise
   */
  async getIdOfCurrentUser(request: Request): Promise<string | null> {
    if (!request.cookies.access_token) return null;
    try {
      const payload = await this.jwtService.verifyAsync(
        request.cookies.access_token,
        {
          secret: this.config.get("internal.jwtSecret"),
        },
      );
      return payload.sub;
    } catch {
      return null;
    }
  }
}
