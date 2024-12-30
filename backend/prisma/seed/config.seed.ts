import { Prisma, PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

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
      secret: false,
    },
    appUrl: {
      type: "string",
      defaultValue: "http://localhost:3000",
      secret: false,
    },
    secureCookies: {
      type: "boolean",
      defaultValue: "false",
    },
    showHomePage: {
      type: "boolean",
      defaultValue: "true",
      secret: false,
    },
    sessionDuration: {
      type: "timespan",
      defaultValue: "3 months",
      secret: false,
    },
  },
  share: {
    allowRegistration: {
      type: "boolean",
      defaultValue: "true",
      secret: false,
    },
    allowUnauthenticatedShares: {
      type: "boolean",
      defaultValue: "false",
      secret: false,
    },
    maxExpiration: {
      type: "timespan",
      defaultValue: "0 days",
      secret: false,
    },
    shareIdLength: {
      type: "number",
      defaultValue: "8",
      secret: false,
    },
    maxSize: {
      type: "number",
      defaultValue: "1000000000",
      secret: false,
    },
    zipCompressionLevel: {
      type: "number",
      defaultValue: "9",
    },
    chunkSize: {
      type: "number",
      defaultValue: "10000000",
      secret: false,
    },
    autoOpenShareModal: {
      type: "boolean",
      defaultValue: "false",
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
      secret: false,
    },
    allowUnauthorizedCertificates: {
      type: "boolean",
      defaultValue: "false",

      secret: false,
    },
    host: {
      type: "string",
      defaultValue: "",
    },
    port: {
      type: "number",
      defaultValue: "0",
    },
    email: {
      type: "string",
      defaultValue: "",
    },
    username: {
      type: "string",
      defaultValue: "",
    },
    password: {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
  },
  ldap: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
      secret: false,
    },

    url: {
      type: "string",
      defaultValue: "",
    },

    bindDn: {
      type: "string",
      defaultValue: "",
    },
    bindPassword: {
      type: "string",
      defaultValue: "",
      obscured: true,
    },

    searchBase: {
      type: "string",
      defaultValue: "",
    },
    searchQuery: {
      type: "string",
      defaultValue: ""
    },

    adminGroups: {
      type: "string",
      defaultValue: ""
    },

    fieldNameMemberOf: {
      type: "string",
      defaultValue: "memberOf",
    },
    fieldNameEmail: {
      type: "string",
      defaultValue: "userPrincipalName",
    }
  },
  oauth: {
    "allowRegistration": {
      type: "boolean",
      defaultValue: "true",
    },
    "ignoreTotp": {
      type: "boolean",
      defaultValue: "true",
    },
    "disablePassword": {
      type: "boolean",
      defaultValue: "false",
      secret: false,
    },
    "github-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "github-clientId": {
      type: "string",
      defaultValue: "",
    },
    "github-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
    "google-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "google-clientId": {
      type: "string",
      defaultValue: "",
    },
    "google-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
    "microsoft-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "microsoft-tenant": {
      type: "string",
      defaultValue: "common",
    },
    "microsoft-clientId": {
      type: "string",
      defaultValue: "",
    },
    "microsoft-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
    "discord-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "discord-limitedGuild": {
      type: "string",
      defaultValue: "",
    },
    "discord-limitedUsers": {
      type: "string",
      defaultValue: "",
    },
    "discord-clientId": {
      type: "string",
      defaultValue: "",
    },
    "discord-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
    "oidc-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "oidc-discoveryUri": {
      type: "string",
      defaultValue: "",
    },
    "oidc-signOut": {
      type: "boolean",
      defaultValue: "false",
    },
    "oidc-scope": {
      type: "string",
      defaultValue: "openid email profile",
    },
    "oidc-usernameClaim": {
      type: "string",
      defaultValue: "",
    },
    "oidc-rolePath": {
      type: "string",
      defaultValue: "",
    },
    "oidc-roleGeneralAccess": {
      type: "string",
      defaultValue: "",
    },
    "oidc-roleAdminAccess": {
      type: "string",
      defaultValue: "",
    },
    "oidc-clientId": {
      type: "string",
      defaultValue: "",
    },
    "oidc-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
  },
  s3: {
    enabled: {
      type: "boolean",
      defaultValue: "false",
    },
    endpoint: {
      type: "string",
      defaultValue: "",
    },
    region: {
      type: "string",
      defaultValue: "",
    },
    bucketName: {
      type: "string",
      defaultValue: "",
    },
    bucketPath: {
      type: "string",
      defaultValue: "",
    },
    key: {
      type: "string",
      defaultValue: "",
      secret: true,
    },
    secret: {
      type: "string",
      defaultValue: "",
      obscured: true,
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
        where: { name_category: { name, category } },
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

seedConfigVariables()
  .then(() => migrateConfigVariables())
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
