import User from "./user.type";

export type Share = {
  id: string;
  files: any;
  creator: User;
  description?: string;
  expiration: Date;
};

export type CreateShare = {
  id: string;
  description?: string;
  recipients: string[];
  expiration: string;
  security: ShareSecurity;
};

export type ShareMetaData = {
  id: string;
  isZipReady: boolean;
};

export type MyShare = Share & {
  views: number;
  cratedAt: Date;
};

export type MyReverseShare = {
  id: string;
  maxShareSize: string;
  shareExpiration: Date;
  share?: MyShare;
};

export type ShareSecurity = {
  maxViews?: number;
  password?: string;
};
