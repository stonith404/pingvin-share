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

  get(key: `${string}.${string}`): any {
    const configVariable = this.configVariables.filter(
      (variable) => `${variable.category}.${variable.name}` == key
    )[0];

    if (!configVariable) throw new Error(`Config variable ${key} not found`);

    if (configVariable.type == "number") return parseInt(configVariable.value);
    if (configVariable.type == "boolean") return configVariable.value == "true";
    if (configVariable.type == "string" || configVariable.type == "text")
      return configVariable.value;
  }

  async getByCategory(category: string) {
    const configVariables = await this.prisma.config.findMany({
      orderBy: { order: "asc" },
      where: { category, locked: { equals: false } },
    });

    return configVariables.map((variable) => {
      return {
        key: `${variable.category}.${variable.name}`,
        ...variable,
      };
    });
  }

  async list() {
    const configVariables = await this.prisma.config.findMany({
      where: { secret: { equals: false } },
    });

    return configVariables.map((variable) => {
      return {
        key: `${variable.category}.${variable.name}`,
        ...variable,
      };
    });
  }

  async updateMany(data: { key: string; value: string | number | boolean }[]) {
    const response: Config[] = [];

    for (const variable of data) {
      response.push(await this.update(variable.key, variable.value));
    }

    return response;
  }

  async update(key: string, value: string | number | boolean) {
    const configVariable = await this.prisma.config.findUnique({
      where: {
        name_category: {
          category: key.split(".")[0],
          name: key.split(".")[1],
        },
      },
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
      where: {
        name_category: {
          category: key.split(".")[0],
          name: key.split(".")[1],
        },
      },
      data: { value: value.toString() },
    });

    this.configVariables = await this.prisma.config.findMany();

    return updatedVariable;
  }
}
