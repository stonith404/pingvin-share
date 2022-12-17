import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import * as moment from "moment";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { authenticator, totp } from "otplib";
import * as qrcode from "qrcode-svg";
import * as crypto from "crypto";
import { AuthSignInTotpDTO } from "./dto/authSignInTotp.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signUp(dto: AuthRegisterDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          isAdmin: !this.config.get("SETUP_FINISHED"),
        },
      });

      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user.id);

      return { accessToken, refreshToken };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`
          );
        }
      }
    }
  }

  async signIn(dto: AuthSignInDTO) {
    if (!dto.email && !dto.username)
      throw new BadRequestException("Email or username is required");

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password)))
      throw new UnauthorizedException("Wrong email or password");

    // Check if the user has TOTP enabled
    if (user.totpVerified) {
      const loginToken = await this.createLoginToken(user.id);

      return { loginToken };
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

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

    const decryptedSecret = this.decryptTotpSecret(totpSecret, dto.password);

    const expected = authenticator.generate(decryptedSecret);

    if (dto.totp !== expected) {
      throw new BadRequestException("Invalid code");
    }

    // Set the login token to used
    await this.prisma.loginToken.update({
      where: { token: token.token },
      data: { used: true },
    });

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async updatePassword(user: User, oldPassword: string, newPassword: string) {
    if (!(await argon.verify(user.password, oldPassword)))
      throw new ForbiddenException("Invalid password");

    const hash = await argon.hash(newPassword);

    this.prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });
  }

  async createAccessToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: "15min",
        secret: this.config.get("JWT_SECRET"),
      }
    );
  }

  async refreshAccessToken(refreshToken: string) {
    const refreshTokenMetaData = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!refreshTokenMetaData || refreshTokenMetaData.expiresAt < new Date())
      throw new UnauthorizedException();

    return this.createAccessToken(refreshTokenMetaData.user);
  }

  async createRefreshToken(userId: string) {
    const refreshToken = (
      await this.prisma.refreshToken.create({
        data: { userId, expiresAt: moment().add(3, "months").toDate() },
      })
    ).token;

    return refreshToken;
  }

  async createLoginToken(userId: string) {
    const loginToken = (
      await this.prisma.loginToken.create({
        data: { userId, expiresAt: moment().add(5, "minutes").toDate() },
      })
    ).token;

    return loginToken;
  }

  encryptTotpSecret(totpSecret: string, password: string) {
    let iv = this.config.get("TOTP_SECRET");
    iv = Buffer.from(iv, "base64");
    const key = crypto
      .createHash("sha256")
      .update(String(password))
      .digest("base64")
      .substr(0, 32);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(totpSecret);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString("base64");
  }

  decryptTotpSecret(encryptedTotpSecret: string, password: string) {
    let iv = this.config.get("TOTP_SECRET");
    iv = Buffer.from(iv, "base64");
    const key = crypto
      .createHash("sha256")
      .update(String(password))
      .digest("base64")
      .substr(0, 32);

    const encryptedText = Buffer.from(encryptedTotpSecret, "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
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
    const encryptedSecret = this.encryptTotpSecret(secret, password);

    const otpURL = totp.keyuri(
      user.username || user.email,
      "pingvin-share",
      secret
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totpEnabled: true,
        totpSecret: encryptedSecret,
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

    const decryptedSecret = this.decryptTotpSecret(totpSecret, password);

    const expected = authenticator.generate(decryptedSecret);

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

    const decryptedSecret = this.decryptTotpSecret(totpSecret, password);

    const expected = authenticator.generate(decryptedSecret);

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
