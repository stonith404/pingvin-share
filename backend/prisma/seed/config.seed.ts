import { Prisma, PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const configVariables: ConfigVariables = {
  internal: {
    jwtSecret: {
      description: "用于签名JWT令牌的长随机字符串",
      type: "string",
      value: crypto.randomBytes(256).toString("base64"),
      locked: true,
    },
  },
  general: {
    appName: {
      description: "应用程序名称",
      type: "string",
      value: "Pingvin Share",
      secret: false,
    },
    appUrl: {
      description: "Pingvin Share在哪个URL上可用",
      type: "string",
      value: "http://localhost:3000",

      secret: false,
    },
    showHomePage: {
      description: "是否显示主页",
      type: "boolean",
      value: "true",
      secret: false,
    },
  },
  share: {
    allowRegistration: {
      description: "是否允许注册",
      type: "boolean",
      value: "true",

      secret: false,
    },
    allowUnauthenticatedShares: {
      description: "未经授权的用户是否可以创建分享",
      type: "boolean",
      value: "false",

      secret: false,
    },
    maxSize: {
      description: "最大共享大小（字节）",
      type: "number",
      value: "1073741824",

      secret: false,
    },
  },
  email: {
    enableShareEmailRecipients: {
      description:
        "是否允许电子邮件分享收件人.仅当您已启用SMTP时才启用此功能.",
      type: "boolean",
      value: "false",

      secret: false,
    },
    shareRecipientsSubject: {
      description:
        "发送给分享收件人的电子邮件的主题.",
      type: "string",
      value: "与您分享的文件",
    },
    shareRecipientsMessage: {
      description:
        "发送给分享收件人的邮件. {creator} 和 {shareUrl} 将替换为创建者的名称和分享URL.",
      type: "text",
      value:
        "嗨!\n{creator} 与您共享了一些文件. 使用此链接查看或下载文件: {shareUrl}\n通过 Pingvin Share 🐧 安全分享",
    },
    reverseShareSubject: {
      description:
        "当有人使用您的反向共享链接创建共享时发送的电子邮件的主题.",
      type: "string",
      value: "已使用外部分享链接",
    },
    reverseShareMessage: {
      description:
        "当有人使用您的反向共享链接创建共享时发送的消息. {shareUrl} 将替换为创建者的名称和共享URL.",
      type: "text",
      value:
        "嗨!\n刚刚使用反向共享链接创建了一个共享: {shareUrl}\n通过 Pingvin Share 🐧 安全分享",
    },
    resetPasswordSubject: {
      description:
        "当用户请求重置密码时发送的电子邮件的主题.",
      type: "string",
      value: "Pingvin Share 密码重置",
    },
    resetPasswordMessage: {
      description:
        "当用户请求重置密码时发送的消息. {url} 将替换为重置密码URL.",
      type: "text",
      value:
        "嗨!\n您请求重置密码. 单击此链接重置您的密码: {url}\n链接将在一小时后过期.\nPingvin Share 🐧",
    },
    inviteSubject: {
      description:
        "管理员邀请用户时发送的电子邮件的主题.",
      type: "string",
      value: "Pingvin Share 邀请",
    },
    inviteMessage: {
      description:
        "管理员邀请用户时发送的消息. {url} 将替换为邀请URL，并且使用 {password} 密码.",
      type: "text",
      value:
        "嗨!\n您被邀请参加 Pingvin Share. 单击此链接接受邀请: {url}\n您的密码是: {password}\nPingvin Share 🐧",
    },
  },
  smtp: {
    enabled: {
      description:
        "您的密码是. 只有当您输入SMTP服务器的主机、端口、电子邮件、用户和密码时，才将此设置为true.",
      type: "boolean",
      value: "false",
      secret: false,
    },
    host: {
      description: "SMTP服务器的主机",
      type: "string",
      value: "",
    },
    port: {
      description: "SMTP服务器的端口",
      type: "number",
      value: "0",
    },
    email: {
      description: "发送电子邮件的电子邮件地址",
      type: "string",
      value: "",
    },
    username: {
      description: "SMTP服务器的用户名",
      type: "string",
      value: "",
    },
    password: {
      description: "SMTP服务器的密码",
      type: "string",
      value: "",
      obscured: true,
    },
  },
};

type ConfigVariables = {
  [category: string]: {
    [variable: string]: Omit<
      Prisma.ConfigCreateInput,
      "name" | "category" | "order"
    >;
  };
};

const prisma = new PrismaClient();

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

  for (const existingConfigVariable of existingConfigVariables) {
    const configVariable =
      configVariables[existingConfigVariable.category]?.[
        existingConfigVariable.name
      ];
    if (!configVariable) {
      await prisma.config.delete({
        where: {
          name_category: {
            name: existingConfigVariable.name,
            category: existingConfigVariable.category,
          },
        },
      });

      // Update the config variable if the metadata changed
    } else if (
      JSON.stringify({
        ...configVariable,
        name: existingConfigVariable.name,
        category: existingConfigVariable.category,
        value: existingConfigVariable.value,
      }) != JSON.stringify(existingConfigVariable)
    ) {
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
        },
      });
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
