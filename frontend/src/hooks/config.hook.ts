import { createContext, useContext } from "react";
import configService from "../services/config.service";
import Config from "../types/config.type";

export const ConfigContext = createContext<Config[] | null>(null);

const useConfig = () => {
  const configVariables = useContext(ConfigContext) as Config[];
  return {
    get: (key: string) => configService.get(key, configVariables),
  };
};

export default useConfig;
