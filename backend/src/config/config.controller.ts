import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AdministratorGuard } from "src/auth/guard/isAdmin.guard";
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
  @UseGuards(AdministratorGuard)
  async listForAdmin() {
    return new AdminConfigDTO().fromList(
      await this.configService.listForAdmin()
    );
  }

  @Patch("admin/:key")
  @UseGuards(AdministratorGuard)
  async update(@Param("key") key: string, @Body() data: UpdateConfigDTO) {
    return new AdminConfigDTO().from(
      await this.configService.update(key, data.value)
    );
  }
}
