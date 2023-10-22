import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { AuthService } from "../auth/auth.service";
import { GetUser } from "../auth/decorator/getUser.decorator";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { ConfigService } from "../config/config.service";
import { OAuthCallbackDto } from "./dto/oauthCallback.dto";
import { ErrorPageExceptionFilter } from "./filter/errorPageException.filter";
import { OAuthGuard } from "./guard/oauth.guard";
import { ProviderGuard } from "./guard/provider.guard";
import { OAuthService } from "./oauth.service";
import { OAuthProvider } from "./provider/oauthProvider.interface";
import { OAuthExceptionFilter } from "./filter/oauthException.filter";

@Controller("oauth")
export class OAuthController {
  constructor(
    private authService: AuthService,
    private oauthService: OAuthService,
    private config: ConfigService,
    @Inject("OAUTH_PROVIDERS")
    private providers: Record<string, OAuthProvider<unknown>>,
  ) {}

  @Get("available")
  available() {
    return this.oauthService.available();
  }

  @Get("status")
  @UseGuards(JwtGuard)
  async status(@GetUser() user: User) {
    return this.oauthService.status(user);
  }

  @Get("auth/:provider")
  @UseGuards(ProviderGuard)
  @UseFilters(ErrorPageExceptionFilter)
  async auth(
    @Param("provider") provider: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const state = nanoid(16);
    const url = await this.providers[provider].getAuthEndpoint(state);
    response.cookie(`oauth_${provider}_state`, state, { sameSite: "lax" });
    response.redirect(url);
  }

  @Get("callback/:provider")
  @UseGuards(ProviderGuard, OAuthGuard)
  @UseFilters(ErrorPageExceptionFilter, OAuthExceptionFilter)
  async callback(
    @Param("provider") provider: string,
    @Query() query: OAuthCallbackDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oauthToken = await this.providers[provider].getToken(query);
    const user = await this.providers[provider].getUserInfo(oauthToken, query);
    const id = await this.authService.getIdOfCurrentUser(request);

    if (id) {
      await this.oauthService.link(
        id,
        provider,
        user.providerId,
        user.providerUsername,
      );
      response.redirect(this.config.get("general.appUrl") + "/account");
    } else {
      const token: {
        accessToken?: string;
        refreshToken?: string;
        loginToken?: string;
      } = await this.oauthService.signIn(user);
      if (token.accessToken) {
        this.authService.addTokensToResponse(
          response,
          token.refreshToken,
          token.accessToken,
        );
        response.redirect(this.config.get("general.appUrl"));
      } else {
        response.redirect(
          this.config.get("general.appUrl") + `/auth/totp/${token.loginToken}`,
        );
      }
    }
  }

  @Post("unlink/:provider")
  @UseGuards(JwtGuard, ProviderGuard)
  @UseFilters(ErrorPageExceptionFilter)
  unlink(@GetUser() user: User, @Param("provider") provider: string) {
    return this.oauthService.unlink(user, provider);
  }
}
