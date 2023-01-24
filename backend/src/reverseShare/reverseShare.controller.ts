import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ConfigService } from "src/config/config.service";
import { ReverseShareTokenDTO } from "src/reverseShare/dto/reverseShareToken.dto";
import { ReverseShareTokenWithShareDTO } from "./dto/reverseShareTokenWithShare";
import { ReverseShareService } from "./reverseShare.service";

@Controller("reverseShares")
export class ReverseShareController {
  constructor(
    private reverseShareService: ReverseShareService,
    private config: ConfigService
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async createReverseShare(
    @Body() body: ReverseShareTokenDTO,
    @GetUser() user: User
  ) {
    const token = await this.reverseShareService.create(body, user.id);

    const link = `${this.config.get("APP_URL")}/upload/${token}`;

    return { token, link };
  }

  @Throttle(20, 60)
  @Get(":reverseShareToken")
  async getReverseShareToken(
    @Param("reverseShareToken") reverseShareToken: string
  ) {
    const isValid = await this.reverseShareService.isValid(reverseShareToken);

    if (!isValid) throw new NotFoundException("Reverse share token not found");

    return new ReverseShareTokenDTO().from(
      await this.reverseShareService.get(reverseShareToken)
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  async getMyReverseShares(@GetUser() user: User) {
    return new ReverseShareTokenWithShareDTO().fromList(
      await this.reverseShareService.getAllByUser(user.id)
    );
  }
}
