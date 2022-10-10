import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { RefreshAccessTokenDTO } from "./dto/refreshAccessToken.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @Post("signUp")
  signUp(@Body() dto: AuthRegisterDTO) {
    if (!this.config.get("ALLOW_REGISTRATION"))
      throw new ForbiddenException("Registration is not allowed");
    return this.authService.signUp(dto);
  }

  @Post("signIn")
  signIn(@Body() dto: AuthSignInDTO) {
    return this.authService.signIn(dto);
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
