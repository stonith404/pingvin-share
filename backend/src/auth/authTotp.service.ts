import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import * as argon from "argon2";
import { authenticator, totp } from "otplib";
import * as qrcode from "qrcode-svg";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AuthSignInTotpDTO } from "./dto/authSignInTotp.dto";

@Injectable()
export class AuthTotpService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) {}

  async signInTotp(dto: AuthSignInTotpDTO) {
    if (!dto.email && !dto.username)
      throw new BadRequestException("Email or username is required");

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password)))
      throw new UnauthorizedException("Wrong email or password");

    const token = await this.prisma.loginToken.findFirst({
      where: {
        token: dto.loginToken,
      },
    });

    if (!token || token.userId != user.id || token.used)
      throw new UnauthorizedException("Invalid login token");

    if (token.expiresAt < new Date())
      throw new UnauthorizedException("Login token expired");

    // Check the TOTP code
    const { totpSecret } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { totpSecret: true },
    });

    if (!totpSecret) {
      throw new BadRequestException("TOTP is not enabled");
    }

    const expected = authenticator.generate(totpSecret);

    if (dto.totp !== expected) {
      throw new BadRequestException("Invalid code");
    }

    // Set the login token to used
    await this.prisma.loginToken.update({
      where: { token: token.token },
      data: { used: true },
    });

    const { refreshToken, refreshTokenId } =
      await this.authService.createRefreshToken(user.id);
    const accessToken = await this.authService.createAccessToken(
      user,
      refreshTokenId
    );

    return { accessToken, refreshToken };
  }

  async enableTotp(user: User, password: string) {
    if (!(await argon.verify(user.password, password)))
      throw new ForbiddenException("Invalid password");

    // Check if we have a secret already
    const { totpVerified } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { totpVerified: true },
    });

    if (totpVerified) {
      throw new BadRequestException("TOTP is already enabled");
    }

    // TODO: Maybe make the issuer configurable with env vars?
    const secret = authenticator.generateSecret();

    const otpURL = totp.keyuri(
      user.username || user.email,
      "pingvin-share",
      secret
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totpEnabled: true,
        totpSecret: secret,
      },
    });

    // TODO: Maybe we should generate the QR code on the client rather than the server?
    const qrCode = new qrcode({
      content: otpURL,
      container: "svg-viewbox",
      join: true,
    }).svg();

    return {
      totpAuthUrl: otpURL,
      totpSecret: secret,
      qrCode:
        "data:image/svg+xml;base64," + Buffer.from(qrCode).toString("base64"),
    };
  }

  // TODO: Maybe require a token to verify that the user who started enabling totp is the one who is verifying it?
  async verifyTotp(user: User, password: string, code: string) {
    if (!(await argon.verify(user.password, password)))
      throw new ForbiddenException("Invalid password");

    const { totpSecret } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { totpSecret: true },
    });

    if (!totpSecret) {
      throw new BadRequestException("TOTP is not in progress");
    }

    const expected = authenticator.generate(totpSecret);

    if (code !== expected) {
      throw new BadRequestException("Invalid code");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totpVerified: true,
      },
    });

    return true;
  }

  async disableTotp(user: User, password: string, code: string) {
    if (!(await argon.verify(user.password, password)))
      throw new ForbiddenException("Invalid password");

    const { totpSecret } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { totpSecret: true },
    });

    if (!totpSecret) {
      throw new BadRequestException("TOTP is not enabled");
    }

    const expected = authenticator.generate(totpSecret);

    if (code !== expected) {
      throw new BadRequestException("Invalid code");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totpVerified: false,
        totpEnabled: false,
        totpSecret: null,
      },
    });

    return true;
  }
}
