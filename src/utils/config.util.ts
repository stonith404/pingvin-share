import { createContext, useContext } from "react";

export const ConfigContext = createContext<any>({});

export const useConfig = () => useContext(ConfigContext);

const getGonfig = () => {
  let publicEnvironmentVariables: any = {};
  Object.entries(process.env).forEach(([key, value]: any) => {
    value as string | number | boolean;
    if (key.startsWith("PUBLIC") && value) {
      key = key.replace("PUBLIC_", "");
      if (value == "false" || value == "true") {
        value = JSON.parse(value);
      } else if (!isNaN(Number(value))) {
        value = parseInt(value as string);
      }
      publicEnvironmentVariables[key] = value;
    }
  });
  return publicEnvironmentVariables;
};

export default { getGonfig };
