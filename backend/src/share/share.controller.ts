import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import * as moment from "moment";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { AdministratorGuard } from "src/auth/guard/isAdmin.guard";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { AdminShareDTO } from "./dto/adminShare.dto";
import { CreateShareDTO } from "./dto/createShare.dto";
import { MyShareDTO } from "./dto/myShare.dto";
import { ShareDTO } from "./dto/share.dto";
import { ShareMetaDataDTO } from "./dto/shareMetaData.dto";
import { SharePasswordDto } from "./dto/sharePassword.dto";
import { CreateShareGuard } from "./guard/createShare.guard";
import { ShareOwnerGuard } from "./guard/shareOwner.guard";
import { ShareSecurityGuard } from "./guard/shareSecurity.guard";
import { ShareTokenSecurity } from "./guard/shareTokenSecurity.guard";
import { ShareService } from "./share.service";
import { ShareCompleteDTO } from './dto/shareComplete.dto';
@Controller("shares")
export class ShareController {
  constructor(
    private shareService: ShareService,
    private jwtService: JwtService,
  ) {}

  @Get("all")
  @UseGuards(JwtGuard, AdministratorGuard)
  async getAllShares() {
    return new AdminShareDTO().fromList(await this.shareService.getShares());
  }

  @Get()
  @UseGuards(JwtGuard)
  async getMyShares(@GetUser() user: User) {
    return new MyShareDTO().fromList(
      await this.shareService.getSharesByUser(user.id),
    );
  }

  @Get(":id")
  @UseGuards(ShareSecurityGuard)
  async get(@Param("id") id: string) {
    return new ShareDTO().from(await this.shareService.get(id));
  }

  @Get(":id/from-owner")
  @UseGuards(ShareOwnerGuard)
  async getFromOwner(@Param("id") id: string) {
    return new ShareDTO().from(await this.shareService.get(id));
  }

  @Get(":id/metaData")
  @UseGuards(ShareSecurityGuard)
  async getMetaData(@Param("id") id: string) {
    return new ShareMetaDataDTO().from(await this.shareService.getMetaData(id));
  }

  @Post()
  @UseGuards(CreateShareGuard)
  async create(
    @Body() body: CreateShareDTO,
    @Req() request: Request,
    @GetUser() user: User,
  ) {
    const { reverse_share_token } = request.cookies;
    return new ShareDTO().from(
      await this.shareService.create(body, user, reverse_share_token),
    );
  }

  @Post(":id/complete")
  @HttpCode(202)
  @UseGuards(CreateShareGuard, ShareOwnerGuard)
  async complete(@Param("id") id: string, @Req() request: Request) {
    const { reverse_share_token } = request.cookies;
    return new ShareCompleteDTO().from(
      await this.shareService.complete(id, reverse_share_token),
    );
  }

  @Delete(":id/complete")
  @UseGuards(ShareOwnerGuard)
  async revertComplete(@Param("id") id: string) {
    return new ShareDTO().from(await this.shareService.revertComplete(id));
  }

  @Delete(":id")
  @UseGuards(ShareOwnerGuard)
  async remove(@Param("id") id: string, @GetUser() user: User) {
    const isDeleterAdmin = user?.isAdmin === true;
    await this.shareService.remove(id, isDeleterAdmin);
  }

  @Throttle({
    default: {
      limit: 10,
      ttl: 60,
    },
  })
  @Get("isShareIdAvailable/:id")
  async isShareIdAvailable(@Param("id") id: string) {
    return this.shareService.isShareIdAvailable(id);
  }

  @HttpCode(200)
  @Throttle({
    default: {
      limit: 20,
      ttl: 5 * 60,
    },
  })
  @UseGuards(ShareTokenSecurity)
  @Post(":id/token")
  async getShareToken(
    @Param("id") id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: SharePasswordDto,
  ) {
    const token = await this.shareService.getShareToken(id, body.password);

    this.clearShareTokenCookies(request, response);
    response.cookie(`share_${id}_token`, token, {
      path: "/",
      httpOnly: true,
    });

    return { token };
  }

  /**
   * Keeps the 10 most recent share token cookies and deletes the rest and all expired ones
   */
  private clearShareTokenCookies(request: Request, response: Response) {
    const shareTokenCookies = Object.entries(request.cookies)
      .filter(([key]) => key.startsWith("share_") && key.endsWith("_token"))
      .map(([key, value]) => ({
        key,
        payload: this.jwtService.decode(value),
      }));

    const expiredTokens = shareTokenCookies.filter(
      (cookie) => cookie.payload.exp < moment().unix(),
    );
    const validTokens = shareTokenCookies.filter(
      (cookie) => cookie.payload.exp >= moment().unix(),
    );

    expiredTokens.forEach((cookie) => response.clearCookie(cookie.key));

    if (validTokens.length > 10) {
      validTokens
        .sort((a, b) => a.payload.exp - b.payload.exp)
        .slice(0, -10)
        .forEach((cookie) => response.clearCookie(cookie.key));
    }
  }
}
