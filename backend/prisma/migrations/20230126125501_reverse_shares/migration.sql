/*
  Warnings:

  - Added the required column `order` to the `Config` table without a default value. This is not possible if the table is not empty.

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
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL
);
INSERT INTO "new_Config" ("category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value", "order") SELECT "category", "description", "key", "locked", "obscured", "secret", "type", "updatedAt", "value", 0 FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_token_key" ON "ReverseShare"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_shareId_key" ON "ReverseShare"("shareId");

-- Custom migration
UPDATE Config SET `order` = 0 WHERE key = "SETUP_FINISHED";
UPDATE Config SET `order` = 0 WHERE key = "JWT_SECRET";
UPDATE Config SET `order` = 0 WHERE key = "TOTP_SECRET";

UPDATE Config SET `order` = 1 WHERE key = "APP_URL";
UPDATE Config SET `order` = 2 WHERE key = "SHOW_HOME_PAGE";
UPDATE Config SET `order` = 3 WHERE key = "ALLOW_REGISTRATION";
UPDATE Config SET `order` = 4 WHERE key = "ALLOW_UNAUTHENTICATED_SHARES";
UPDATE Config SET `order` = 5 WHERE key = "MAX_SHARE_SIZE";
UPDATE Config SET `order` = 6, key = "ENABLE_SHARE_EMAIL_RECIPIENTS" WHERE key = "ENABLE_EMAIL_RECIPIENTS";
UPDATE Config SET `order` = 7, key = "SHARE_RECEPIENTS_EMAIL_MESSAGE" WHERE key = "EMAIL_MESSAGE";
UPDATE Config SET `order` = 8, key = "SHARE_RECEPIENTS_EMAIL_SUBJECT" WHERE key = "EMAIL_SUBJECT";
UPDATE Config SET `order` = 12 WHERE key = "SMTP_HOST";
UPDATE Config SET `order` = 13 WHERE key = "SMTP_PORT";
UPDATE Config SET `order` = 14 WHERE key = "SMTP_EMAIL";
UPDATE Config SET `order` = 15 WHERE key = "SMTP_USERNAME";
UPDATE Config SET `order` = 16 WHERE key = "SMTP_PASSWORD";

INSERT INTO Config (`order`, `key`, `description`, `type`, `value`, `category`, `secret`, `updatedAt`) VALUES (11, "SMTP_ENABLED", "Whether SMTP is enabled. Only set this to true if you entered the host, port, email, user and password of your SMTP server.", "boolean", IFNULL((SELECT value FROM Config WHERE key="ENABLE_SHARE_EMAIL_RECIPIENTS"), "false"), "smtp", 0, strftime('%s', 'now'));
