import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
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

  @Patch("admin")
  @UseGuards(JwtGuard, AdministratorGuard)
  async updateMany(@Body() data: UpdateConfigDTO[]) {
    await this.configService.updateMany(data);
  }

  @Post("admin/finishSetup")
  @UseGuards(JwtGuard, AdministratorGuard)
  async finishSetup() {
    return await this.configService.finishSetup();
  }
}
