import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import * as moment from "moment";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";

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
          password: hash,
        },
      });

      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user.id);

      return { accessToken, refreshToken };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new BadRequestException("Credentials taken");
        }
      }
    }
  }

  async signIn(dto: AuthSignInDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user || !(await argon.verify(user.password, dto.password)))
      throw new UnauthorizedException("Wrong email or password");

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return { accessToken, refreshToken };
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
}
