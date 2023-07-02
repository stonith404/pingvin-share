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
  token: string;
  shares: MyShare[];
  sharesOptions: ReverseShareOptions;
};

export type ShareSecurity = {
  maxViews?: number;
  password?: string;
};

export type ReverseShareOptions = {
  easyMode: boolean;

  customLinkEnabled: boolean;
  passwordEnabled: boolean;
  descriptionEnabled: boolean;
  maximalViewsEnabled: boolean;
};

export const defaultReverseShareOptions: ReverseShareOptions = {
  easyMode: false,
  customLinkEnabled: true,
  passwordEnabled: true,
  descriptionEnabled: true,
  maximalViewsEnabled: true,
};
