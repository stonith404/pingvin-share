import User from "./user.type";

export type Share = {
  id: string;
  files: any;
  creator: User;
  expiration: Date;
};

export type ShareMetaData = {
  id: string;
  isZipReady: boolean;
};

export type MyShare = Share & {
  views: number;
  cratedAt: Date;
};

export type ShareSecurity = {
  maxViews?: number;
  password?: string;
};
