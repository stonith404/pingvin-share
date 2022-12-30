/*
  Warnings:

  - Added the required column `category` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Config" ("description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value") SELECT "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";

 UPDATE config SET category = "internal" WHERE key = "SETUP_FINISHED";
 UPDATE config SET category = "internal" WHERE key = "TOTP_SECRET";
 UPDATE config SET category = "internal" WHERE key = "JWT_SECRET";
 UPDATE config SET category = "general" WHERE key = "APP_URL";
 UPDATE config SET category = "general" WHERE key = "SHOW_HOME_PAGE";
 UPDATE config SET category = "share" WHERE key = "ALLOW_REGISTRATION";
 UPDATE config SET category = "share" WHERE key = "ALLOW_UNAUTHENTICATED_SHARES";
 UPDATE config SET category = "share" WHERE key = "MAX_FILE_SIZE";
 UPDATE config SET category = "email" WHERE key = "ENABLE_EMAIL_RECIPIENTS";
 UPDATE config SET category = "email" WHERE key = "EMAIL_MESSAGE";
 UPDATE config SET category = "email" WHERE key = "EMAIL_SUBJECT";
 UPDATE config SET category = "email" WHERE key = "SMTP_HOST";
 UPDATE config SET category = "email" WHERE key = "SMTP_PORT";
 UPDATE config SET category = "email" WHERE key = "SMTP_EMAIL";
 UPDATE config SET category = "email" WHERE key = "SMTP_USERNAME";
 UPDATE config SET category = "email" WHERE key = "SMTP_PASSWORD";

CREATE TABLE "new_Config" (
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Config" ("description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value", "category") SELECT "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value", "category" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;