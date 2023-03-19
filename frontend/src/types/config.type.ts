type Config = {
  key: string;
  value: string;
  editedValue: string;
  type: string;
};

export type UpdateConfig = {
  key: string;
  editedValue: string;
};

export type AdminConfig = Config & {
  name: string;
  updatedAt: Date;
  secret: boolean;
  description: string;
  obscured: boolean;
};

export type AdminConfigGroupedByCategory = {
  [key: string]: [
    Config & {
      updatedAt: Date;
      secret: boolean;
      description: string;
      obscured: boolean;
      category: string;
    }
  ];
};

export type ConfigVariablesCategory = {
  category: string;
  count: number;
};

export type ConfigHook = {
  configVariables: Config[];
  refresh: () => void;
};

export default Config;
