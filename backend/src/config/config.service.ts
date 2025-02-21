import {BadRequestException, Inject, Injectable, NotFoundException,} from "@nestjs/common";
import {Config} from "@prisma/client";
import {EventEmitter} from "events";
import {PrismaService} from "src/prisma/prisma.service";
import {stringToTimespan} from "src/utils/date.util";
import * as fs from "fs";
import {parse as yamlParse} from "yaml";
import * as argon from "argon2";

/**
 * ConfigService extends EventEmitter to allow listening for config updates,
 * now only `update` event will be emitted.
 */
@Injectable()
export class ConfigService extends EventEmitter {

  yamlConfig?: YamlConfig;

  constructor(
    @Inject("CONFIG_VARIABLES") private configVariables: Config[],
    private prisma: PrismaService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.loadYamlConfig();

    if (this.yamlConfig) {
      await this.migrateConfigVariables();
      await this.migrateInitUser();
    }
  }

  private async loadYamlConfig() {
    let configFile: string = ""
    try {
      configFile = fs.readFileSync('../config.yaml', 'utf8')
    } catch (e) {
      console.info("config.yaml is not set: ")
    }
    try {
      this.yamlConfig = yamlParse(configFile);
    } catch (e) {
      console.error("failed to parse config.yaml: ", e)
    }
  }

  private async migrateInitUser(): Promise<void> {
    if (!this.yamlConfig.initUser.enabled) return;

    const userCount = await this.prisma.user.count({
      where: {isAdmin: true},
    });
    if (userCount === 1) {
      console.info("Skip initial user creation. Admin user is already existent.")
      return
    }
    await this.prisma.user.create({
      data: {
        email: this.yamlConfig.initUser.email,
        username: this.yamlConfig.initUser.username,
        password: this.yamlConfig.initUser.password ? await argon.hash(this.yamlConfig.initUser.password) : null,
        isAdmin: this.yamlConfig.initUser.isAdmin,
      },
    });
  }

  private async migrateConfigVariables(): Promise<void> {
    const configVariables = Object.entries(this.yamlConfig).flatMap(([category, variables]) => {
      return Object.entries(variables).map(([name, value]) => {
        return {
          category,
          name,
          value: value.toString(),
          type: typeof value,
          locked: false,
          defaultValue: value.toString(),
        };
      });
    });

    for (const configVariable of configVariables) {
      const existingConfigVariable = await this.prisma.config.findUnique({
        where: {
          name_category: {
            category: configVariable.category,
            name: configVariable.name,
          },
        },
      });

      // TODO: Implement order
      // const variableOrder = Object.keys(configVariables[existingConfigVariable.category]).indexOf(existingConfigVariable.name);
      const variableOrder = 0;

      if (!existingConfigVariable) {
        await this.prisma.config.create({
          data: {
            ...configVariable,
            name: configVariable.name,
            category: configVariable.category,
            value: configVariable.value,
            order: variableOrder,
          },
        });
      } else {
        await this.prisma.config.update({
          where: {
            name_category: {
              category: configVariable.category,
              name: configVariable.name,
            },
          },
          data: {
            value: configVariable.value,
            type: configVariable.type,
            locked: configVariable.locked,
            defaultValue: configVariable.defaultValue,
          },
        });
      }
    }
  }

  get(key: `${string}.${string}`): any {
    const configVariable = this.configVariables.filter(
      (variable) => `${variable.category}.${variable.name}` == key,
    )[0];

    if (!configVariable) throw new Error(`Config variable ${key} not found`);

    const value = configVariable.value ?? configVariable.defaultValue;

    if (configVariable.type == "number" || configVariable.type == "filesize")
      return parseInt(value);
    if (configVariable.type == "boolean") return value == "true";
    if (configVariable.type == "string" || configVariable.type == "text")
      return value;
    if (configVariable.type == "timespan") return stringToTimespan(value);
  }

  async getByCategory(category: string) {
    const configVariables = await this.prisma.config.findMany({
      orderBy: {order: "asc"},
      where: {category, locked: {equals: false}},
    });

    return configVariables.map((variable) => {
      return {
        ...variable,
        key: `${variable.category}.${variable.name}`,
        value: variable.value ?? variable.defaultValue,
        allowEdit: !this.yamlConfig,
      };
    });
  }

  async list() {
    const configVariables = await this.prisma.config.findMany({
      where: {secret: {equals: false}},
    });

    return configVariables.map((variable) => {
      return {
        ...variable,
        key: `${variable.category}.${variable.name}`,
        value: variable.value ?? variable.defaultValue,
        allowEdit: !this.yamlConfig,
      };
    });
  }

  async updateMany(data: { key: string; value: string | number | boolean }[]) {
    if (this.yamlConfig) throw new BadRequestException("You are only allowed to update config variables via the config.yaml file");

    const response: Config[] = [];

    for (const variable of data) {
      response.push(await this.update(variable.key, variable.value));
    }

    return response;
  }

  async update(key: string, value: string | number | boolean) {
    if (this.yamlConfig) throw new BadRequestException("You are only allowed to update config variables via the config.yaml file");

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

    if (value === "") {
      value = null;
    } else if (
      typeof value != configVariable.type &&
      typeof value == "string" &&
      configVariable.type != "text" &&
      configVariable.type != "timespan"
    ) {
      throw new BadRequestException(
        `Config variable must be of type ${configVariable.type}`,
      );
    }

    this.validateConfigVariable(key, value);

    const updatedVariable = await this.prisma.config.update({
      where: {
        name_category: {
          category: key.split(".")[0],
          name: key.split(".")[1],
        },
      },
      data: {value: value === null ? null : value.toString()},
    });

    this.configVariables = await this.prisma.config.findMany();

    this.emit("update", key, value);

    return updatedVariable;
  }

  validateConfigVariable(key: string, value: string | number | boolean) {
    const validations = [
      {
        key: "share.shareIdLength",
        condition: (value: number) => value >= 2 && value <= 50,
        message: "Share ID length must be between 2 and 50",
      },
      {
        key: "share.zipCompressionLevel",
        condition: (value: number) => value >= 0 && value <= 9,
        message: "Zip compression level must be between 0 and 9",
      },
      // TODO add validation for timespan type
    ];

    const validation = validations.find((validation) => validation.key == key);
    if (validation && !validation.condition(value as any)) {
      throw new BadRequestException(validation.message);
    }
  }
}

export interface YamlConfig {
  general: General;
  share: Share;
  smtp: SMTP;
  ldap: LDAP;
  oauth: Oauth;
  s3: S3;
  legal: Legal;
  initUser: InitUser;
}

export interface General {
  appName: string;
  appUrl: string;
  secureCookies: string;
  showHomePage: string;
  sessionDuration: string;
}

export interface LDAP {
  enabled: string;
  url: string;
  bindDn: string;
  bindPassword: string;
  searchBase: string;
  searchQuery: string;
  adminGroups: string;
  fieldNameMemberOf: string;
  fieldNameEmail: string;
}

export interface Legal {
  enabled: string;
  imprintText: string;
  imprintUrl: string;
  privacyPolicyText: string;
  privacyPolicyUrl: string;
}

export interface Oauth {
  allowRegistration: string;
  ignoreTotp: string;
  disablePassword: string;
  githubEnabled: string;
  githubClientId: string;
  githubClientSecret: string;
  googleEnabled: string;
  googleClientId: string;
  googleClientSecret: string;
  microsoftEnabled: string;
  microsoftTenant: string;
  microsoftClientId: string;
  microsoftClientSecret: string;
  discordEnabled: string;
  discordLimitedGuild: string;
  discordLimitedUsers: string;
  discordClientId: string;
  discordClientSecret: string;
  oidcEnabled: string;
  oidcDiscoveryUri: string;
  oidcSignOut: string;
  oidcScope: string;
  oidcUsernameClaim: string;
  oidcRolePath: string;
  oidcRoleGeneralAccess: string;
  oidcRoleAdminAccess: string;
  oidcClientId: string;
  oidcClientSecret: string;
}

export interface S3 {
  enabled: string;
  endpoint: string;
  region: string;
  bucketName: string;
  bucketPath: string;
  key: string;
  secret: string;
}

export interface Share {
  allowRegistration: string;
  allowUnauthenticatedShares: string;
  maxExpiration: string;
  shareIdLength: string;
  maxSize: string;
  zipCompressionLevel: string;
  chunkSize: string;
  autoOpenShareModal: string;
}

export interface SMTP {
  enabled: string;
  allowUnauthorizedCertificates: string;
  host: string;
  port: string;
  email: string;
  username: string;
  password: string;
}

export interface InitUser {
  enabled: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  ldapDN: string;
}
