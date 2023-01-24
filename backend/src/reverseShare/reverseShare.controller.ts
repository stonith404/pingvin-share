import {
  Body,
  Controller,
  Delete,
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
import { CreateReverseShareDTO } from "./dto/createReverseShare.dto";
import { ReverseShareDTO } from "./dto/reverseShare.dto";
import { ReverseShareTokenWithShare } from "./dto/reverseShareTokenWithShare";
import { ReverseShareOwnerGuard } from "./guards/reverseShareOwner.guard";
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
    @Body() body: CreateReverseShareDTO,
    @GetUser() user: User
  ) {
    const token = await this.reverseShareService.create(body, user.id);

    const link = `${this.config.get("APP_URL")}/upload/${token}`;

    return { token, link };
  }

  @Throttle(20, 60)
  @Get(":reverseShareToken")
  async getReverseShareByToken(
    @Param("reverseShareToken") reverseShareToken: string
  ) {
    const isValid = await this.reverseShareService.isValid(reverseShareToken);

    if (!isValid) throw new NotFoundException("Reverse share token not found");

    return new ReverseShareDTO().from(
      await this.reverseShareService.getByToken(reverseShareToken)
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  async getMyReverseShares(@GetUser() user: User) {
    return new ReverseShareTokenWithShare().fromList(
      await this.reverseShareService.getAllByUser(user.id)
    );
  }

  @Delete(":reverseShareId")
  @UseGuards(JwtGuard, ReverseShareOwnerGuard)
  async deleteReverseShare(@Param("reverseShareId") id: string) {
    await this.reverseShareService.remove(id);
  }
}
