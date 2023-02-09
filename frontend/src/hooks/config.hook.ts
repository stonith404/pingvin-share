import { createContext, useContext } from "react";
import configService from "../services/config.service";
import { ConfigHook } from "../types/config.type";

export const ConfigContext = createContext<ConfigHook>({
  configVariables: [],
  refresh: async () => {},
});

const useConfig = () => {
  const configContext = useContext(ConfigContext);
  return {
    get: (key: string) => configService.get(key, configContext.configVariables),
    refresh: async () => configContext.refresh(),
  };
};

export default useConfig;
