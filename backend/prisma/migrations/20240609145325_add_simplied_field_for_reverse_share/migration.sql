-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReverseShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "shareExpiration" DATETIME NOT NULL,
    "maxShareSize" TEXT NOT NULL,
    "sendEmailNotification" BOOLEAN NOT NULL,
    "remainingUses" INTEGER NOT NULL,
    "simplified" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "ReverseShare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReverseShare" ("createdAt", "creatorId", "id", "maxShareSize", "remainingUses", "sendEmailNotification", "shareExpiration", "token") SELECT "createdAt", "creatorId", "id", "maxShareSize", "remainingUses", "sendEmailNotification", "shareExpiration", "token" FROM "ReverseShare";
DROP TABLE "ReverseShare";
ALTER TABLE "new_ReverseShare" RENAME TO "ReverseShare";
CREATE UNIQUE INDEX "ReverseShare_token_key" ON "ReverseShare"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
