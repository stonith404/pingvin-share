import { PrismaClient } from "@prisma/client";
import configVariables from "../../src/configVariables";

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
