/*
  Warnings:

  - The primary key for the `Config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `key` on the `Config` table. All the data in the column will be lost.
  - Added the required column `name` to the `Config` table without a default value. This is not possible if the table is not empty.

*/

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("name", "category")
);
-- INSERT INTO "new_Config" ("category", "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value") SELECT "category", "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value" FROM "Config";

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'internal', 'jwtSecret', "description", "locked", "obscured", 0, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'JWT_SECRET';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'general', 'appUrl', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'APP_URL';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'general', 'showHomePage', "description", "locked", "obscured", 2, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SHOW_HOME_PAGE';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'share', 'allowRegistration', "description", "locked", "obscured", 0, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'ALLOW_REGISTRATION';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'share', 'allowUnauthenticatedShares', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'ALLOW_UNAUTHENTICATED_SHARES';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'share', 'maxSize', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'MAX_SHARE_SIZE';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'enableShareEmailRecipients', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'ENABLE_SHARE_EMAIL_RECIPIENTS';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'shareRecipientsSubject', "description", "locked", "obscured", 2, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SHARE_RECEPIENTS_EMAIL_SUBJECT';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'shareRecipientsMessage', "description", "locked", "obscured", 3, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SHARE_RECEPIENTS_EMAIL_MESSAGE';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'reverseShareSubject', "description", "locked", "obscured", 4, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'REVERSE_SHARE_EMAIL_SUBJECT';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'reverseShareMessage', "description", "locked", "obscured", 5, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'REVERSE_SHARE_EMAIL_MESSAGE';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'resetPasswordSubject', "description", "locked", "obscured", 6, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'RESET_PASSWORD_EMAIL_SUBJECT';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'email', 'resetPasswordMessage', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'RESET_PASSWORD_EMAIL_MESSAGE';

INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'enabled', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_ENABLED';


INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'host', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_HOST';


INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'port', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_PORT';


INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'email', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_EMAIL';


INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'username', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_USERNAME';


INSERT INTO new_Config ("category", "name" , "description", "locked", "obscured", "order", "secret", "type", "updatedAt", "value")
SELECT 'smtp', 'password', "description", "locked", "obscured", 1, "secret", "type", "updatedAt", "value" FROM Config WHERE key = 'SMTP_PASSWORD';


DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
