import { Prisma, PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const configVariables: Prisma.ConfigCreateInput[] = [
  {
    order: 0,
    key: "SETUP_FINISHED",
    description: "Status of the setup wizard",
    type: "boolean",
    value: "false",
    category: "internal",
    secret: false,
    locked: true,
  },
  {
    order: 0,
    key: "JWT_SECRET",
    description: "Long random string used to sign JWT tokens",
    type: "string",
    value: crypto.randomBytes(256).toString("base64"),
    category: "internal",
    locked: true,
  },
  {
    order: 0,
    key: "TOTP_SECRET",
    description: "A 16 byte random string used to generate TOTP secrets",
    type: "string",
    value: crypto.randomBytes(16).toString("base64"),
    category: "internal",
    locked: true,
  },
  {
    order: 1,
    key: "APP_URL",
    description: "On which URL Pingvin Share is available",
    type: "string",
    value: "http://localhost:3000",
    category: "general",
    secret: false,
  },
  {
    order: 2,
    key: "SHOW_HOME_PAGE",
    description: "Whether to show the home page",
    type: "boolean",
    value: "true",
    category: "general",
    secret: false,
  },
  {
    order: 3,
    key: "ALLOW_REGISTRATION",
    description: "Whether registration is allowed",
    type: "boolean",
    value: "true",
    category: "share",
    secret: false,
  },
  {
    order: 4,
    key: "ALLOW_UNAUTHENTICATED_SHARES",
    description: "Whether unauthorized users can create shares",
    type: "boolean",
    value: "false",
    category: "share",
    secret: false,
  },
  {
    order: 5,

    key: "MAX_SHARE_SIZE",
    description: "Maximum share size in bytes",
    type: "number",
    value: "1073741824",
    category: "share",
    secret: false,
  },

  {
    order: 6,
    key: "ENABLE_SHARE_EMAIL_RECIPIENTS",
    description:
      "Whether to allow emails to share recipients. Only enable this if you have enabled SMTP.",
    type: "boolean",
    value: "false",
    category: "email",
    secret: false,
  },
  {
    order: 7,
    key: "SHARE_RECEPIENTS_EMAIL_MESSAGE",
    description:
      "Message which gets sent to the share recipients. {creator} and {shareUrl} will be replaced with the creator's name and the share URL.",
    type: "text",
    value:
      "Hey!\n{creator} shared some files with you. View or download the files with this link: {shareUrl}\nShared securely with Pingvin Share 🐧",
    category: "email",
  },
  {
    order: 8,
    key: "SHARE_RECEPIENTS_EMAIL_SUBJECT",
    description:
      "Subject of the email which gets sent to the share recipients.",
    type: "string",
    value: "Files shared with you",
    category: "email",
  },
  {
    order: 9,
    key: "REVERSE_SHARE_EMAIL_MESSAGE",
    description:
      "Message which gets sent when someone created a share with your reverse share link. {shareUrl} will be replaced with the creator's name and the share URL.",
    type: "text",
    value:
      "Hey!\nA share was just created with your reverse share link: {shareUrl}\nShared securely with Pingvin Share 🐧",
    category: "email",
  },
  {
    order: 10,
    key: "REVERSE_SHARE_EMAIL_SUBJECT",
    description:
      "Subject of the email which gets sent when someone created a share with your reverse share link.",
    type: "string",
    value: "Reverse share link used",
    category: "email",
  },
  {
    order: 11,
    key: "SMTP_ENABLED",
    description:
      "Whether SMTP is enabled. Only set this to true if you entered the host, port, email, user and password of your SMTP server.",
    type: "boolean",
    value: "false",
    category: "smtp",
    secret: false,
  },
  {
    order: 12,
    key: "SMTP_HOST",
    description: "Host of the SMTP server",
    type: "string",
    value: "",
    category: "smtp",
  },
  {
    order: 13,
    key: "SMTP_PORT",
    description: "Port of the SMTP server",
    type: "number",
    value: "0",
    category: "smtp",
  },
  {
    order: 14,
    key: "SMTP_EMAIL",
    description: "Email address which the emails get sent from",
    type: "string",
    value: "",
    category: "smtp",
  },
  {
    order: 15,
    key: "SMTP_USERNAME",
    description: "Username of the SMTP server",
    type: "string",
    value: "",
    category: "smtp",
  },
  {
    order: 16,
    key: "SMTP_PASSWORD",
    description: "Password of the SMTP server",
    type: "string",
    value: "",
    obscured: true,
    category: "smtp",
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const variable of configVariables) {
    const existingConfigVariable = await prisma.config.findUnique({
      where: { key: variable.key },
    });

    // Create a new config variable if it doesn't exist
    if (!existingConfigVariable) {
      await prisma.config.create({
        data: variable,
      });
    }
  }

  const configVariablesFromDatabase = await prisma.config.findMany();

  // Delete the config variable if it doesn't exist anymore
  for (const configVariableFromDatabase of configVariablesFromDatabase) {
    const configVariable = configVariables.find(
      (v) => v.key == configVariableFromDatabase.key
    );
    if (!configVariable) {
      await prisma.config.delete({
        where: { key: configVariableFromDatabase.key },
      });

      // Update the config variable if the metadata changed
    } else if (
      JSON.stringify({
        ...configVariable,
        key: configVariableFromDatabase.key,
        value: configVariableFromDatabase.value,
      }) != JSON.stringify(configVariableFromDatabase)
    ) {
      await prisma.config.update({
        where: { key: configVariableFromDatabase.key },
        data: {
          ...configVariable,
          key: configVariableFromDatabase.key,
          value: configVariableFromDatabase.value,
        },
      });
    }
  }
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
