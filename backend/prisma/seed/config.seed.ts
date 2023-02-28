import { Prisma, PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const configVariables: ConfigVariables = {
  internal: {
    setupStatus: {
      description: "Status of the setup wizard",
      type: "string",
      value: "STARTED", // STARTED, REGISTERED, FINISHED
      secret: false,
      locked: true,
    },
    jwtSecret: {
      description: "Long random string used to sign JWT tokens",
      type: "string",
      value: crypto.randomBytes(256).toString("base64"),
      locked: true,
    },
  },
  general: {
    appName: {
      description: "Name of the application",
      type: "string",
      value: "Pingvin Share",
      secret: false,
    },
    appUrl: {
      description: "On which URL Pingvin Share is available",
      type: "string",
      value: "http://localhost:3000",

      secret: false,
    },
    showHomePage: {
      description: "Whether to show the home page",
      type: "boolean",
      value: "true",
      secret: false,
    },
  },

  share: {
    allowRegistration: {
      description: "Whether registration is allowed",
      type: "boolean",
      value: "true",

      secret: false,
    },
    allowUnauthenticatedShares: {
      description: "Whether unauthorized users can create shares",
      type: "boolean",
      value: "false",

      secret: false,
    },
    maxSize: {
      description: "Maximum share size in bytes",
      type: "number",
      value: "1073741824",

      secret: false,
    },
  },
  email: {
    enableShareEmailRecipients: {
      description:
        "Whether to allow emails to share recipients. Only enable this if you have enabled SMTP.",
      type: "boolean",
      value: "false",

      secret: false,
    },
    shareRecipientsEmailSubject: {
      description:
        "Subject of the email which gets sent to the share recipients.",
      type: "string",
      value: "Files shared with you",
    },
    shareRecipientsEmailMessage: {
      description:
        "Message which gets sent to the share recipients. {creator} and {shareUrl} will be replaced with the creator's name and the share URL.",
      type: "text",
      value:
        "Hey!\n{creator} shared some files with you. View or download the files with this link: {shareUrl}\nShared securely with Pingvin Share 🐧",
    },
    reverseShareEmailSubject: {
      description:
        "Subject of the email which gets sent when someone created a share with your reverse share link.",
      type: "string",
      value: "Reverse share link used",
    },
    reverseShareEmailMessage: {
      description:
        "Message which gets sent when someone created a share with your reverse share link. {shareUrl} will be replaced with the creator's name and the share URL.",
      type: "text",
      value:
        "Hey!\nA share was just created with your reverse share link: {shareUrl}\nShared securely with Pingvin Share 🐧",
    },
    resetPasswordEmailSubject: {
      description:
        "Subject of the email which gets sent when a user requests a password reset.",
      type: "string",
      value: "Pingvin Share password reset",
    },
    resetPasswordEmailMessage: {
      description:
        "Message which gets sent when a user requests a password reset. {url} will be replaced with the reset password URL.",
      type: "text",
      value:
        "Hey!\nYou requested a password reset. Click this link to reset your password: {url}\nThe link expires in a hour.\nPingvin Share 🐧",
    },
    inviteEmailSubject: {
      description:
        "Subject of the email which gets sent when an admin invites an user.",
      type: "string",
      value: "Pingvin Share invite",
    },
    inviteEmailMessage: {
      description:
        "Message which gets sent when an admin invites an user. {url} will be replaced with the invite URL and {password} with the password.",
      type: "text",
      value:
        "Hey!\nYou were invited to Pingvin Share. Click this link to accept the invite: {url}\nYour password is: {password}\nPingvin Share 🐧",
    },
  },
  smtp: {
    enabled: {
      description:
        "Whether SMTP is enabled. Only set this to true if you entered the host, port, email, user and password of your SMTP server.",
      type: "boolean",
      value: "false",
      secret: false,
    },
    host: {
      description: "Host of the SMTP server",
      type: "string",
      value: "",
    },
    port: {
      description: "Port of the SMTP server",
      type: "number",
      value: "0",
    },
    email: {
      description: "Email address which the emails get sent from",
      type: "string",
      value: "",
    },
    username: {
      description: "Username of the SMTP server",
      type: "string",
      value: "",
    },
    password: {
      description: "Password of the SMTP server",
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

async function main() {
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

  const configVariablesFromDatabase = await prisma.config.findMany();

  // Delete the config variable if it doesn't exist anymore
  //   for (const configVariableFromDatabase of configVariablesFromDatabase) {
  //     const configVariable = configVariables.find(
  //       (v) => v.key == configVariableFromDatabase.key
  //     );
  //     if (!configVariable) {
  //       await prisma.config.delete({
  //         where: { key: configVariableFromDatabase.key },
  //       });

  //       // Update the config variable if the metadata changed
  //     } else if (
  //       JSON.stringify({
  //         ...configVariable,
  //         key: configVariableFromDatabase.key,
  //         value: configVariableFromDatabase.value,
  //       }) != JSON.stringify(configVariableFromDatabase)
  //     ) {
  //       await prisma.config.update({
  //         where: { key: configVariableFromDatabase.key },
  //         data: {
  //           ...configVariable,
  //           key: configVariableFromDatabase.key,
  //           value: configVariableFromDatabase.value,
  //         },
  //       });
  //     }
  //   }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
