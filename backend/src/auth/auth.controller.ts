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
import { EnableTotpDTO } from "./dto/enableTotp.dto";
import { JwtGuard } from "./guard/jwt.guard";
import { VerifyTotpDTO } from "./dto/verifyTotp.dto";

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

  // TODO: Implement recovery codes to disable 2FA just in case someone gets locked out
  @Post("totp/enable")
  @UseGuards(JwtGuard)
  async enableTotp(@GetUser() user: User, @Body() body: EnableTotpDTO) {
    return this.authService.enableTotp(user, body.password);
  }

  @Post("totp/verify")
  @UseGuards(JwtGuard)
  async verifyTotp(@GetUser() user: User, @Body() body: VerifyTotpDTO) {
    return this.authService.verifyTotp(user, body.password, body.code);
  }

  @Post("totp/disable")
  @UseGuards(JwtGuard)
  async disableTotp(@GetUser() user: User, @Body() body: VerifyTotpDTO) {
    // Note: We use VerifyTotpDTO here because it has both fields we need: password and totp code
    return this.authService.disableTotp(user, body.password, body.code);
  }

  // @Post("totp/enable")
  // @UseGuards(JwtGuard)
  // async enableTotp(@GetUser() user: User, @Body() body: EnableTotpDTO) {
  //     return this.authService.enableTotp(user, body.code);
  // }
}
