import User from "./user.type";

export type Share = {
  id: string;
  files: any;
  creator: User;
  description?: string;
  expiration: Date;
  hasPassword: boolean;
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
  createdAt: Date;
};

export type MyReverseShare = {
  id: string;
  maxShareSize: string;
  shareExpiration: Date;
  remainingUses: number;
  shares: MyShare[];
};

export type ShareSecurity = {
  maxViews?: number;
  password?: string;
};
