import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const configVariables = [
  {
    key: "setupFinished",
    type: "boolean",
    default: "false",
    secret: false,
    locked: true
  },
  {
    key: "appUrl",
    type: "string",
    default: "http://localhost:3000",
    secret: false,
  },
  {
    key: "showHomePage",
    type: "boolean",
    default: "true",
    secret: false,
  },
  {
    key: "allowRegistration",
    type: "boolean",
    default: "true",
    secret: false,
  },
  {
    key: "allowUnauthenticatedShares",
    type: "boolean",
    default: "false",
    secret: false,
  },
  {
    key: "maxFileSize",
    type: "number",
    default: "1000000000",
    secret: false,
  },
  {
    key: "jwtSecret",
    type: "string",
    default: "long-random-string",
    locked: true
  },
  {
    key: "emailRecipientsEnabled",
    type: "boolean",
    default: "false",
    secret: false,
  },
  {
    key: "smtpHost",
    type: "string",
    default: "",
  },
  {
    key: "smtpPort",
    type: "number",
    default: "",
  },
  {
    key: "smtpEmail",
    type: "string",
    default: "",
  },
  {
    key: "smtpPassword",
    type: "string",
    default: "",
  },
];

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
    } else {
      // Update the config variable if the default value has changed
      if (existingConfigVariable.default != variable.default) {
        await prisma.config.update({
          where: { key: variable.key },
          data: { default: variable.default },
        });
      }
    }
  }

  // Delete the config variable if it doesn't exist anymore
  const configVariablesFromDatabase = await prisma.config.findMany();

  for (const configVariableFromDatabase of configVariablesFromDatabase) {
    if (!configVariables.find((v) => v.key == configVariableFromDatabase.key)) {
      await prisma.config.delete({
        where: { key: configVariableFromDatabase.key },
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
