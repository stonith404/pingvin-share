import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { ConfigService } from "src/config/config.service";
import { AuthService } from "./auth.service";
import { AuthTotpService } from "./authTotp.service";
import { GetUser } from "./decorator/getUser.decorator";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { AuthSignInTotpDTO } from "./dto/authSignInTotp.dto";
import { EnableTotpDTO } from "./dto/enableTotp.dto";
import { ResetPasswordDTO } from "./dto/resetPassword.dto";
import { TokenDTO } from "./dto/token.dto";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { VerifyTotpDTO } from "./dto/verifyTotp.dto";
import { JwtGuard } from "./guard/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private authTotpService: AuthTotpService,
    private config: ConfigService
  ) {}

  @Post("signUp")
  @Throttle(10, 5 * 60)
  async signUp(
    @Body() dto: AuthRegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    if (!this.config.get("ALLOW_REGISTRATION"))
      throw new ForbiddenException("Registration is not allowed");

    const result = await this.authService.signUp(dto);

    response = this.addTokensToResponse(
      response,
      result.refreshToken,
      result.accessToken
    );

    return result;
  }

  @Post("signIn")
  @Throttle(10, 5 * 60)
  @HttpCode(200)
  async signIn(
    @Body() dto: AuthSignInDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.signIn(dto);

    if (result.accessToken && result.refreshToken) {
      response = this.addTokensToResponse(
        response,
        result.refreshToken,
        result.accessToken
      );
    }

    return result;
  }

  @Post("signIn/totp")
  @Throttle(10, 5 * 60)
  @HttpCode(200)
  async signInTotp(
    @Body() dto: AuthSignInTotpDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authTotpService.signInTotp(dto);

    response = this.addTokensToResponse(
      response,
      result.refreshToken,
      result.accessToken
    );

    return new TokenDTO().from(result);
  }

  @Post("resetPassword/:email")
  @Throttle(5, 5 * 60)
  @HttpCode(204)
  async requestResetPassword(@Param("email") email: string) {
    return await this.authService.requestResetPassword(email);
  }

  @Post("resetPassword")
  @Throttle(5, 5 * 60)
  @HttpCode(204)
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    return await this.authService.resetPassword(dto.token, dto.password);
  }

  @Patch("password")
  @UseGuards(JwtGuard)
  async updatePassword(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: UpdatePasswordDTO
  ) {
    const result = await this.authService.updatePassword(
      user,
      dto.oldPassword,
      dto.password
    );

    response = this.addTokensToResponse(response, result.refreshToken);
    return new TokenDTO().from(result);
  }

  @Post("token")
  @HttpCode(200)
  async refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    if (!request.cookies.refresh_token) throw new UnauthorizedException();

    const accessToken = await this.authService.refreshAccessToken(
      request.cookies.refresh_token
    );
    response = this.addTokensToResponse(response, undefined, accessToken);
    return new TokenDTO().from({ accessToken });
  }

  @Post("signOut")
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.signOut(request.cookies.access_token);
    response.cookie("access_token", "accessToken", { maxAge: -1 });
    response.cookie("refresh_token", "", {
      path: "/api/auth/token",
      httpOnly: true,
      maxAge: -1,
    });
  }

  @Post("totp/enable")
  @UseGuards(JwtGuard)
  async enableTotp(@GetUser() user: User, @Body() body: EnableTotpDTO) {
    return this.authTotpService.enableTotp(user, body.password);
  }

  @Post("totp/verify")
  @UseGuards(JwtGuard)
  async verifyTotp(@GetUser() user: User, @Body() body: VerifyTotpDTO) {
    return this.authTotpService.verifyTotp(user, body.password, body.code);
  }

  @Post("totp/disable")
  @UseGuards(JwtGuard)
  async disableTotp(@GetUser() user: User, @Body() body: VerifyTotpDTO) {
    // Note: We use VerifyTotpDTO here because it has both fields we need: password and totp code
    return this.authTotpService.disableTotp(user, body.password, body.code);
  }

  private addTokensToResponse(
    response: Response,
    refreshToken?: string,
    accessToken?: string
  ) {
    if (accessToken)
      response.cookie("access_token", accessToken, { sameSite: "lax" });
    if (refreshToken)
      response.cookie("refresh_token", refreshToken, {
        path: "/api/auth/token",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30 * 3,
      });

    return response;
  }
}
