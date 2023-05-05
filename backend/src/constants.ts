export const DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./data";
export const SHARE_DIRECTORY =  `${DATA_DIRECTORY}/uploads/shares` 
export const DATABASE_URL = process.env.DATABASE_URL || "file:../data/pingvin-share.db?connection_limit=1";