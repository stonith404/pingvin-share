import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Config } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ConfigService {
  constructor(
    @Inject("CONFIG_VARIABLES") private configVariables: Config[],
    private prisma: PrismaService
  ) {}

  get(key: string): any {
    const configVariable = this.configVariables.filter(
      (variable) => variable.key == key
    )[0];

    if (!configVariable) throw new Error(`Config variable ${key} not found`);

    if (configVariable.type == "number") return parseInt(configVariable.value);
    if (configVariable.type == "boolean") return configVariable.value == "true";
    if (configVariable.type == "string" || configVariable.type == "text")
      return configVariable.value;
  }

  async listForAdmin() {
    return await this.prisma.config.findMany({
      orderBy: { order: "asc" },
      where: { locked: { equals: false } },
    });
  }

  async list() {
    return await this.prisma.config.findMany({
      where: { secret: { equals: false } },
    });
  }

  async updateMany(data: { key: string; value: string | number | boolean }[]) {
    for (const variable of data) {
      await this.update(variable.key, variable.value);
    }

    return data;
  }

  async update(key: string, value: string | number | boolean) {
    const configVariable = await this.prisma.config.findUnique({
      where: { key },
    });

    if (!configVariable || configVariable.locked)
      throw new NotFoundException("Config variable not found");

    if (
      typeof value != configVariable.type &&
      typeof value == "string" &&
      configVariable.type != "text"
    ) {
      throw new BadRequestException(
        `Config variable must be of type ${configVariable.type}`
      );
    }

    const updatedVariable = await this.prisma.config.update({
      where: { key },
      data: { value: value.toString() },
    });

    this.configVariables = await this.prisma.config.findMany();

    return updatedVariable;
  }

  async changeSetupStatus(status: "STARTED" | "REGISTERED" | "FINISHED") {
    const updatedVariable = await this.prisma.config.update({
      where: { key: "SETUP_STATUS" },
      data: { value: status },
    });

    this.configVariables = await this.prisma.config.findMany();

    return updatedVariable;
  }
}
