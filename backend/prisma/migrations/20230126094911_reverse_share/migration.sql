/*
  Warnings:

  - The primary key for the `Config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ReverseShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "shareExpiration" DATETIME NOT NULL,
    "maxShareSize" TEXT NOT NULL,
    "sendEmailNotification" BOOLEAN NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "shareId" TEXT,
    CONSTRAINT "ReverseShare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReverseShare_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "id" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Config" ("category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value") SELECT "category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_token_key" ON "ReverseShare"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_shareId_key" ON "ReverseShare"("shareId");


-- Add ids to existing settings


UPDATE Config SET id = 1 WHERE key = "SETUP_FINISHED";
UPDATE Config SET id = 2 WHERE key = "APP_URL";
UPDATE Config SET id = 3 WHERE key = "SHOW_HOME_PAGE";
UPDATE Config SET id = 4 WHERE key = "ALLOW_REGISTRATION";
UPDATE Config SET id = 5 WHERE key = "ALLOW_UNAUTHENTICATED_SHARES";
UPDATE Config SET id = 6 WHERE key = "MAX_SHARE_SIZE";
UPDATE Config SET id = 7 WHERE key = "JWT_SECRET";
UPDATE Config SET id = 8 WHERE key = "TOTP_SECRET";
UPDATE Config SET id = 9, key = "ENABLE_SHARE_EMAIL_RECIPIENTS" WHERE key = "ENABLE_EMAIL_RECIPIENTS";
UPDATE Config SET id = 10, key = "SHARE_RECEPIENTS_EMAIL_MESSAGE" WHERE key = "EMAIL_MESSAGE";
UPDATE Config SET id = 11, key = "SHARE_RECEPIENTS_EMAIL_SUBJECT" WHERE key = "EMAIL_SUBJECT";
UPDATE Config SET id = 15 WHERE key = "SMTP_HOST";
UPDATE Config SET id = 16 WHERE key = "SMTP_PORT";
UPDATE Config SET id = 17 WHERE key = "SMTP_EMAIL";
UPDATE Config SET id = 18 WHERE key = "SMTP_USERNAME";
UPDATE Config SET id = 19 WHERE key = "SMTP_PASSWORD";

INSERT INTO Config (`id`, `key`, `description`, `type`, `value`, `category`, `secret`, `updatedAt`) VALUES (14, "SMTP_ENABLED", "Whether SMTP is enabled. Only set this to true if you entered the host, port, email, user and password of your SMTP server.", "boolean", IFNULL((SELECT value FROM Config WHERE key="ENABLE_SHARE_EMAIL_RECIPIENTS"), "false"), "smtp", 0, strftime('%s', 'now'));

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Config" ("id", "category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value") SELECT "id", "category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
DELETE from Config WHERE key="MAX_FILE_SIZE";
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
