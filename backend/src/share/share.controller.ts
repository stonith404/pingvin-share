import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { CreateShareDTO } from "./dto/createShare.dto";
import { MyShareDTO } from "./dto/myShare.dto";
import { ShareDTO } from "./dto/share.dto";
import { ShareMetaDataDTO } from "./dto/shareMetaData.dto";
import { SharePasswordDto } from "./dto/sharePassword.dto";
import { ShareOwnerGuard } from "./guard/shareOwner.guard";
import { ShareSecurityGuard } from "./guard/shareSecurity.guard";
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
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard, ShareOwnerGuard)
  async complete(@Param("id") id: string) {
    return new ShareDTO().from(await this.shareService.complete(id));
  }

  @Get("isShareIdAvailable/:id")
  async isShareIdAvailable(@Param("id") id: string) {
    return this.shareService.isShareIdAvailable(id);
  }

  @Post(":id/password")
  async exchangeSharePasswordWithToken(
    @Param("id") id: string,
    @Body() body: SharePasswordDto
  ) {
    return this.shareService.exchangeSharePasswordWithToken(id, body.password);
  }
}
