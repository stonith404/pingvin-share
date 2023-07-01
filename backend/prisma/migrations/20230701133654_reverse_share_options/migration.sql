-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReverseShareOptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareId" TEXT NOT NULL,
    "easyMode" BOOLEAN NOT NULL DEFAULT false,
    "customLinkEnabled" BOOLEAN NOT NULL DEFAULT true,
    "passwordEnabled" BOOLEAN NOT NULL DEFAULT true,
    "descriptionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maximalViewsEnabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ReverseShareOptions_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "ReverseShare" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReverseShareOptions" ("customLinkEnabled", "descriptionEnabled", "easyMode", "id", "maximalViewsEnabled", "passwordEnabled", "shareId") SELECT "customLinkEnabled", "descriptionEnabled", "easyMode", "id", "maximalViewsEnabled", "passwordEnabled", "shareId" FROM "ReverseShareOptions";
DROP TABLE "ReverseShareOptions";
ALTER TABLE "new_ReverseShareOptions" RENAME TO "ReverseShareOptions";
CREATE UNIQUE INDEX "ReverseShareOptions_shareId_key" ON "ReverseShareOptions"("shareId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
