import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { ConfigService } from "src/config/config.service";
import { AuthService } from "./auth.service";
import { GetUser } from "./decorator/getUser.decorator";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { RefreshAccessTokenDTO } from "./dto/refreshAccessToken.dto";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { JwtGuard } from "./guard/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @Throttle(10, 5 * 60)
  @Post("signUp")
  async signUp(@Body() dto: AuthRegisterDTO) {
    if (!this.config.get("ALLOW_REGISTRATION"))
      throw new ForbiddenException("Registration is not allowed");
    return this.authService.signUp(dto);
  }

  @Throttle(10, 5 * 60)
  @Post("signIn")
  @HttpCode(200)
  signIn(@Body() dto: AuthSignInDTO) {
    return this.authService.signIn(dto);
  }

  @Patch("password")
  @UseGuards(JwtGuard)
  async updatePassword(@GetUser() user: User, @Body() dto: UpdatePasswordDTO) {
    await this.authService.updatePassword(user, dto.oldPassword, dto.password);
  }

  @Post("token")
  @HttpCode(200)
  async refreshAccessToken(@Body() body: RefreshAccessTokenDTO) {
    const accessToken = await this.authService.refreshAccessToken(
      body.refreshToken
    );
    return { accessToken };
  }
}
