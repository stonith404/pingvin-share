import { Models } from "node-appwrite";

export type ShareDocument = {
  securityID: string;
  createdAt: number;
  expiresAt: number;
  visitorCount: number;
  enabled: boolean;
  users?: string[];
} & Models.Document;

export type SecurityDocument = {
  password: string;
  maxVisitors: number;
} & Models.Document;
