type Config = {
  key: string;
  value: string;
  type: string;
};

export type UpdateConfig = {
  key: string;
  value: string;
};

export type AdminConfig = Config & {
  updatedAt: Date;
  secret: boolean;
  description: string;
  obscured: boolean;
  category: string;
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

export type ConfigHook = {
  configVariables: Config[];
  refresh: () => void;
};

export default Config;
