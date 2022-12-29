import Config, { AdminConfig, UpdateConfig } from "../types/config.type";
import api from "./api.service";

const list = async (): Promise<Config[]> => {
  return (await api.get("/configs")).data;
};

const listForAdmin = async (): Promise<AdminConfig[]> => {
  return (await api.get("/configs/admin")).data;
};

const updateMany = async (data: UpdateConfig[]): Promise<AdminConfig[]> => {
  return (await api.patch("/configs/admin", data)).data;
};

const get = (key: string, configVariables: Config[]): any => {
  if (!configVariables) return null;

  const configVariable = configVariables.filter(
    (variable) => variable.key == key
  )[0];

  if (!configVariable) throw new Error(`Config variable ${key} not found`);

  if (configVariable.type == "number") return parseInt(configVariable.value);
  if (configVariable.type == "boolean") return configVariable.value == "true";
  if (configVariable.type == "string" || configVariable.type == "text")
    return configVariable.value;
};

const finishSetup = async (): Promise<AdminConfig[]> => {
  return (await api.post("/configs/admin/finishSetup")).data;
};

export default {
  list,
  listForAdmin,
  updateMany,
  get,
  finishSetup,
};
