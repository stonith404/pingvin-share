import {Prisma, PrismaClient} from "@prisma/client";
import * as crypto from "crypto";

import * as fs from "fs";
import {parse as yamlParse} from "yaml";
import * as argon from "argon2";

let configFile: string = ""
let yamlConfig: YamlConfig = {} as YamlConfig;
try {
  configFile = fs.readFileSync('../config.yaml', 'utf8')
} catch (e) {
  console.info("config.yaml is not set")
}
try {
  yamlConfig = yamlParse(configFile) as YamlConfig;
} catch (e) {
  console.error("failed to parse config.yaml: ", e)
  process.exit(1);
}

const configVariables: ConfigVariables = {
  internal: {
    jwtSecret: {
      type: "string",
      value: crypto.randomBytes(256).toString("base64"),
      locked: true,
    },
  },
  general: {
    appName: {
      type: "string",
      defaultValue: "Pingvin Share",
      value: yamlConfig?.general?.appName,
      secret: false,
    },
    appUrl: {
      type: "string",
      defaultValue: "http://localhost:3000",
      value: yamlConfig?.general?.appUrl,
      secret: false,
    },
    secureCookies: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.general?.secureCookies.toString(),
    },
    showHomePage: {
      type: "boolean",
      defaultValue: "true",
      value: yamlConfig?.general?.showHomePage.toString(),
      secret: false,
    },
    sessionDuration: {
      type: "timespan",
      defaultValue: "3 months",
      value: yamlConfig?.general?.sessionDuration,
      secret: false,
    },
  },
  share: {
    allowRegistration: {
      type: "boolean",
      defaultValue: "true",
      value: yamlConfig?.share?.allowRegistration.toString(),
      secret: false,
    },
    allowUnauthenticatedShares: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.share?.allowUnauthenticatedShares.toString(),
      secret: false,
    },
    maxExpiration: {
      type: "timespan",
      defaultValue: "0 days",
      value: yamlConfig?.share?.maxExpiration,
      secret: false,
    },
    shareIdLength: {
      type: "number",
      defaultValue: "8",
      value: yamlConfig?.share?.shareIdLength.toString(),
      secret: false,
    },
    maxSize: {
      type: "filesize",
      defaultValue: "1000000000",
      value: yamlConfig?.share?.maxSize.toString(),
      secret: false,
    },
    zipCompressionLevel: {
      type: "number",
      defaultValue: "9",
      value: yamlConfig?.share?.zipCompressionLevel.toString(),
    },
    chunkSize: {
      type: "filesize",
      defaultValue: "10000000",
      value: yamlConfig?.share?.chunkSize.toString(),
      secret: false,
    },
    autoOpenShareModal: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.share?.autoOpenShareModal.toString(),
      secret: false,
    },
  },
  email: {
    enableShareEmailRecipients: {
      type: "boolean",
      defaultValue: "false",
      secret: false,
    },
    shareRecipientsSubject: {
      type: "string",
      defaultValue: "Files shared with you",
    },
    shareRecipientsMessage: {
      type: "text",
      defaultValue:
        "Hey!\n\n{creator} ({creatorEmail}) shared some files with you, view or download the files with this link: {shareUrl}\n\nThe share will expire {expires}.\n\nNote: {desc}\n\nShared securely with Pingvin Share 🐧",
    },
    reverseShareSubject: {
      type: "string",
      defaultValue: "Reverse share link used",
    },
    reverseShareMessage: {
      type: "text",
      defaultValue:
        "Hey!\n\nA share was just created with your reverse share link: {shareUrl}\n\nShared securely with Pingvin Share 🐧",
    },
    resetPasswordSubject: {
      type: "string",
      defaultValue: "Pingvin Share password reset",
    },
    resetPasswordMessage: {
      type: "text",
      defaultValue:
        "Hey!\n\nYou requested a password reset. Click this link to reset your password: {url}\nThe link expires in a hour.\n\nPingvin Share 🐧",
    },
    inviteSubject: {
      type: "string",
      defaultValue: "Pingvin Share invite",
    },
    inviteMessage: {
      type: "text",
      defaultValue:
        'Hey!\n\nYou were invited to Pingvin Share. Click this link to accept the invite: {url}\n\nYou can use the email "{email}" and the password "{password}" to sign in.\n\nPingvin Share 🐧',
    },
  },
  smtp: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.smtp?.enabled.toString(),
      secret: false,
    },
    allowUnauthorizedCertificates: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.smtp?.allowUnauthorizedCertificates.toString(),
      secret: false,
    },
    host: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.smtp?.host,
    },
    port: {
      type: "number",
      defaultValue: "0",
      value: yamlConfig?.smtp?.port.toString(),
    },
    email: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.smtp?.email,
    },
    username: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.smtp?.username,
    },
    password: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.smtp?.password,
      obscured: true,
    },
  },
  ldap: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.ldap?.enabled.toString(),
      secret: false,
    },

    url: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.url,
    },

    bindDn: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.bindDn,
    },
    bindPassword: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.bindPassword,
      obscured: true,
    },

    searchBase: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.searchBase,
    },
    searchQuery: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.searchQuery,
    },

    adminGroups: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.ldap?.adminGroups,
    },

    fieldNameMemberOf: {
      type: "string",
      defaultValue: "memberOf",
      value: yamlConfig?.ldap?.fieldNameMemberOf,
    },
    fieldNameEmail: {
      type: "string",
      defaultValue: "userPrincipalName",
      value: yamlConfig?.ldap?.fieldNameEmail,
    }
  },
  oauth: {
    "allowRegistration": {
      type: "boolean",
      defaultValue: "true",
      value: yamlConfig?.oauth?.allowRegistration.toString(),
    },
    "ignoreTotp": {
      type: "boolean",
      defaultValue: "true",
      value: yamlConfig?.oauth?.ignoreTotp.toString(),
    },
    "disablePassword": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.disablePassword.toString(),
      secret: false,
    },
    "github-enabled": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.githubEnabled.toString(),
    },
    "github-clientId": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.githubClientId,
    },
    "github-clientSecret": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.githubClientSecret,
      obscured: true,
    },
    "google-enabled": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.googleEnabled.toString(),
    },
    "google-clientId": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.googleClientId,
    },
    "google-clientSecret": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.googleClientSecret,
      obscured: true,
    },
    "microsoft-enabled": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.microsoftEnabled.toString(),
    },
    "microsoft-tenant": {
      type: "string",
      defaultValue: "common",
      value: yamlConfig?.oauth?.microsoftTenant,
    },
    "microsoft-clientId": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.microsoftClientId,
    },
    "microsoft-clientSecret": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.microsoftClientSecret,
      obscured: true,
    },
    "discord-enabled": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.discordEnabled.toString(),
    },
    "discord-limitedGuild": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.discordLimitedGuild,
    },
    "discord-limitedUsers": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.discordLimitedUsers,
    },
    "discord-clientId": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.discordClientId,
    },
    "discord-clientSecret": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.discordClientSecret,
      obscured: true,
    },
    "oidc-enabled": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.oidcClientId.toString(),
    },
    "oidc-discoveryUri": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcDiscoveryUri,
    },
    "oidc-signOut": {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.oauth?.oidcSignOut.toString(),
    },
    "oidc-scope": {
      type: "string",
      defaultValue: "openid email profile",
      value: yamlConfig?.oauth?.oidcScope,
    },
    "oidc-usernameClaim": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcUsernameClaim,
    },
    "oidc-rolePath": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcRolePath,
    },
    "oidc-roleGeneralAccess": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcRoleGeneralAccess,
    },
    "oidc-roleAdminAccess": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcRoleAdminAccess,
    },
    "oidc-clientId": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcClientId,
    },
    "oidc-clientSecret": {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.oauth?.oidcClientSecret,
      obscured: true,
    },
  },
  s3: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.s3?.enabled.toString(),
    },
    endpoint: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.endpoint,
    },
    region: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.region,
    },
    bucketName: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.bucketName,
    },
    bucketPath: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.bucketPath,
    },
    key: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.key,
      secret: true,
    },
    secret: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.s3?.secret,
      obscured: true,
    },
  },
  legal: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
      value: yamlConfig?.legal?.enabled.toString(),
      secret: false,
    },
    imprintText: {
      type: "text",
      defaultValue: "",
      value: yamlConfig?.legal?.imprintText,
      secret: false,
    },
    imprintUrl: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.legal?.imprintUrl,
      secret: false,
    },
    privacyPolicyText: {
      type: "text",
      defaultValue: "",
      value: yamlConfig?.legal?.privacyPolicyText,
      secret: false,
    },
    privacyPolicyUrl: {
      type: "string",
      defaultValue: "",
      value: yamlConfig?.legal?.privacyPolicyUrl,
      secret: false,
    },
  }
};

type ConfigVariables = {
  [category: string]: {
    [variable: string]: Omit<
      Prisma.ConfigCreateInput,
      "name" | "category" | "order"
    >;
  };
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "file:../data/pingvin-share.db?connection_limit=1",
    },
  },
});

async function seedConfigVariables() {
  for (const [category, configVariablesOfCategory] of Object.entries(
    configVariables
  )) {
    let order = 0;
    for (const [name, properties] of Object.entries(
      configVariablesOfCategory
    )) {
      const existingConfigVariable = await prisma.config.findUnique({
        where: {name_category: {name, category}},
      });

      // Create a new config variable if it doesn't exist
      if (!existingConfigVariable) {
        await prisma.config.create({
          data: {
            order,
            name,
            ...properties,
            category,
          },
        });
      }
      order++;
    }
  }
}

async function migrateConfigVariables() {
  const existingConfigVariables = await prisma.config.findMany();
  const orderMap: { [category: string]: number } = {};

  for (const existingConfigVariable of existingConfigVariables) {
    const configVariable =
      configVariables[existingConfigVariable.category]?.[
        existingConfigVariable.name
        ];

    // Delete the config variable if it doesn't exist in the seed
    if (!configVariable) {
      await prisma.config.delete({
        where: {
          name_category: {
            name: existingConfigVariable.name,
            category: existingConfigVariable.category,
          },
        },
      });

      // Update the config variable if it exists in the seed
    } else {
      const variableOrder = Object.keys(
        configVariables[existingConfigVariable.category]
      ).indexOf(existingConfigVariable.name);
      await prisma.config.update({
        where: {
          name_category: {
            name: existingConfigVariable.name,
            category: existingConfigVariable.category,
          },
        },
        data: {
          ...configVariable,
          name: existingConfigVariable.name,
          category: existingConfigVariable.category,
          value: existingConfigVariable.value,
          order: variableOrder,
        },
      });
      orderMap[existingConfigVariable.category] = variableOrder + 1;
    }
  }
}

async function migrateInitUser(): Promise<void> {
  if (yamlConfig.initUser.enabled) {
    const userCount = await prisma.user.count({
      where: { isAdmin: true },
    });
    if (userCount === 1) {
      console.info("Skip initial user creation. Admin user is already existent.")
      return
    }
    await prisma.user.create({
      data: {
        email: yamlConfig.initUser.email,
        username: yamlConfig.initUser.username,
        password: yamlConfig.initUser.password ? await argon.hash(yamlConfig.initUser.password) : null,
        isAdmin: yamlConfig.initUser.isAdmin,
      },
    });
  }
}

seedConfigVariables()
  .then(async () => {
    await migrateConfigVariables();
    if (configFile !== "") await migrateInitUser()
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

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
