import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigDTO } from "./dto/config.dto";

@Controller("configs")
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  async list() {
    return new ConfigDTO().fromList(await this.configService.list())
  }

  @Get("admin")
  async listForAdmin() {
    return await this.configService.listForAdmin();
  }
}
