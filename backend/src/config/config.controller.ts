import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdministratorGuard } from "src/auth/guard/isAdmin.guard";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ConfigService } from "./config.service";
import { AdminConfigDTO } from "./dto/adminConfig.dto";
import { ConfigDTO } from "./dto/config.dto";
import UpdateConfigDTO from "./dto/updateConfig.dto";

@Controller("configs")
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  async list() {
    return new ConfigDTO().fromList(await this.configService.list());
  }

  @Get("admin")
  @UseGuards(JwtGuard, AdministratorGuard)
  async listForAdmin() {
    return new AdminConfigDTO().fromList(
      await this.configService.listForAdmin()
    );
  }

  @Patch("admin/:key")
  @UseGuards(JwtGuard, AdministratorGuard)
  async update(@Param("key") key: string, @Body() data: UpdateConfigDTO) {
    return new AdminConfigDTO().from(
      await this.configService.update(key, data.value)
    );
  }

  @Post("admin/finishSetup")
  @UseGuards(JwtGuard, AdministratorGuard)
  async finishSetup() {
    return await this.configService.finishSetup();
  }
}
