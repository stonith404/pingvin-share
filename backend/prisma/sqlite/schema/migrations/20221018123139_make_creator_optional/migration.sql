-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Share" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadLocked" BOOLEAN NOT NULL DEFAULT false,
    "isZipReady" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "expiration" DATETIME NOT NULL,
    "creatorId" TEXT,
    CONSTRAINT "Share_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Share" ("createdAt", "creatorId", "expiration", "id", "isZipReady", "uploadLocked", "views") SELECT "createdAt", "creatorId", "expiration", "id", "isZipReady", "uploadLocked", "views" FROM "Share";
DROP TABLE "Share";
ALTER TABLE "new_Share" RENAME TO "Share";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
