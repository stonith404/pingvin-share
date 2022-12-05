type Config = {
  key: string;
  value: string;
  type: string;
};

export type AdminConfig = Config & {
  updatedAt: Date;
  secret: boolean;
  description: string;
};

export default Config;
