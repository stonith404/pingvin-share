/*
  Warnings:

  - You are about to drop the column `description` on the `Config` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "defaultValue" TEXT NOT NULL DEFAULT '',
    "value" TEXT,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("name", "category")
);
INSERT INTO "new_Config" ("category", "defaultValue", "locked", "name", "obscured", "order", "secret", "type", "updatedAt", "value") SELECT "category", "defaultValue", "locked", "name", "obscured", "order", "secret", "type", "updatedAt", "value" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
