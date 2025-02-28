import * as fs from "fs";
import * as yaml from "yaml";
import { configVariables } from "../backend/prisma/seed/config.seed";
import translations from "../frontend/src/i18n/translations/en-US";

// Prepare an object that only contains the categories, keys and values
const configVariablesWithDefaultValues = {};
for (const [category, variables] of Object.entries(configVariables)) {
  if (category == "internal") continue;
  for (const [variableName, { defaultValue }] of Object.entries(variables)) {
    if (!configVariablesWithDefaultValues[category]) {
      configVariablesWithDefaultValues[category] = {};
    }
    configVariablesWithDefaultValues[category][variableName] = defaultValue;
  }
}

// As `initUser` is not part of the `configVariables` object, we add it manually
configVariablesWithDefaultValues["initUser"] = {
  enabled: false,
  username: "admin",
  email: "admin@example.com",
  password: "my-secure-password",
  isAdmin: true,
  ldapDN: "",
};

// Create the yaml document
const doc: any = new yaml.Document(configVariablesWithDefaultValues);

// Add the descriptions imported from `en-US.ts` as comments
for (const category of doc.contents.items) {
  //  As `initUser` can't be configured from the UI, we have to add the description manually
  if (category.key.value === "initUser") {
    category.key.commentBefore =
      "This configuration is used to create the initial user when the application is started for the first time.\n";
    category.key.commentBefore +=
      "Make sure to change at least the password as soon as you log in!";
  }

  for (const variable of category.value.items) {
    variable.key.commentBefore = getDescription(
      category.key.value,
      variable.key.value
    );
  }
}
doc.commentBefore =
  "This configuration is pre-filled with the default values.\n";
doc.commentBefore +=
  "You can remove keys you don't want to set. If a key is missing, the value set in the UI will be used; if that is also unset, the default value applies.";

// Write the YAML content to a file
fs.writeFileSync("../config.example.yaml", doc.toString({ indent: 2 }), "utf8");
console.log("YAML file generated successfully!");

// Helper functions
function getDescription(category: string, name: string) {
  return translations[
    `admin.config.${category}.${camelToKebab(name)}.description`
  ];
}

function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
