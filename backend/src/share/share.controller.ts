import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { Request } from "express";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtGuard } from "src/auth/guard/jwt.guard";
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
@Controller("shares")
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getMyShares(@GetUser() user: User) {
    return new MyShareDTO().fromList(
      await this.shareService.getSharesByUser(user.id)
    );
  }

  @Get(":id")
  @UseGuards(ShareSecurityGuard)
  async get(@Param("id") id: string) {
    return new ShareDTO().from(await this.shareService.get(id));
  }

  @Get(":id/metaData")
  @UseGuards(ShareSecurityGuard)
  async getMetaData(@Param("id") id: string) {
    return new ShareMetaDataDTO().from(await this.shareService.getMetaData(id));
  }

  @Post()
  @UseGuards(CreateShareGuard)
  async create(@Body() body: CreateShareDTO, @GetUser() user: User) {
    return new ShareDTO().from(await this.shareService.create(body, user));
  }

  @Delete(":id")
  @UseGuards(JwtGuard, ShareOwnerGuard)
  async remove(@Param("id") id: string) {
    await this.shareService.remove(id);
  }

  @Post(":id/complete")
  @HttpCode(202)
  @UseGuards(CreateShareGuard, ShareOwnerGuard)
  async complete(@Param("id") id: string, @Req() request: Request) {
    const {reverse_share_token} =  request.cookies;
    return new ShareDTO().from(await this.shareService.complete(id, reverse_share_token));
  }

  @Throttle(10, 60)
  @Get("isShareIdAvailable/:id")
  async isShareIdAvailable(@Param("id") id: string) {
    return this.shareService.isShareIdAvailable(id);
  }

  @HttpCode(200)
  @Throttle(10, 5 * 60)
  @UseGuards(ShareTokenSecurity)
  @Post(":id/token")
  async getShareToken(@Param("id") id: string, @Body() body: SharePasswordDto) {
    return this.shareService.getShareToken(id, body.password);
  }

  @Post("reverseShareToken")
  @UseGuards(CreateShareGuard)
  async createReverseShareToken(
    @Body() body: CreateShareDTO,
    @GetUser() user: User
  ) {
    return new ShareDTO().from(await this.shareService.create(body, user));
  }

  @Throttle(20, 60)
  @Get("reverseShareToken/:reverseShareToken")
  @UseGuards(CreateShareGuard)
  async isReverseShareTokenValid(
    @Param("reverseShareToken") reverseShareToken: string
  ) {
    const isValid = await this.shareService.isReverseShareTokenValid(
      reverseShareToken
    );

    return { isValid };
  }
}
