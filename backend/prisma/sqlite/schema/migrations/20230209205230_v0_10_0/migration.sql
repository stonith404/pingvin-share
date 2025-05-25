/*
  Warnings:

  - You are about to drop the column `shareId` on the `ReverseShare` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `ReverseShare` table. All the data in the column will be lost.
  - Added the required column `remainingUses` to the `ReverseShare` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "ResetPasswordToken" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Disable TOTP as secret isn't encrypted anymore
UPDATE User SET totpEnabled=false, totpSecret=null, totpVerified=false WHERE totpSecret IS NOT NULL;

-- RedefineTables
CREATE TABLE "new_Share" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadLocked" BOOLEAN NOT NULL DEFAULT false,
    "isZipReady" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "expiration" DATETIME NOT NULL,
    "description" TEXT,
    "removedReason" TEXT,
    "creatorId" TEXT,
    "reverseShareId" TEXT,
    CONSTRAINT "Share_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Share_reverseShareId_fkey" FOREIGN KEY ("reverseShareId") REFERENCES "ReverseShare" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Share" ("createdAt", "creatorId", "description", "expiration", "id", "isZipReady", "removedReason", "uploadLocked", "views", "reverseShareId")
SELECT "createdAt", "creatorId", "description", "expiration", "id", "isZipReady", "removedReason", "uploadLocked", "views", (SELECT id FROM ReverseShare WHERE shareId=Share.id)
FROM "Share";


DROP TABLE "Share";
ALTER TABLE "new_Share" RENAME TO "Share";
CREATE TABLE "new_ReverseShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "shareExpiration" DATETIME NOT NULL,
    "maxShareSize" TEXT NOT NULL,
    "sendEmailNotification" BOOLEAN NOT NULL,
    "remainingUses" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "ReverseShare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReverseShare" ("createdAt", "creatorId", "id", "maxShareSize", "sendEmailNotification", "shareExpiration", "token", "remainingUses") SELECT "createdAt", "creatorId", "id", "maxShareSize", "sendEmailNotification", "shareExpiration", "token", iif("ReverseShare".used, 0, 1) FROM "ReverseShare";
DROP TABLE "ReverseShare";
ALTER TABLE "new_ReverseShare" RENAME TO "ReverseShare";
CREATE UNIQUE INDEX "ReverseShare_token_key" ON "ReverseShare"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_userId_key" ON "ResetPasswordToken"("userId");
