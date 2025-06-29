-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "defaultValue" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "obscured" BOOLEAN NOT NULL DEFAULT false,
    "secret" BOOLEAN NOT NULL DEFAULT true,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("name", "category")
);
INSERT INTO "new_Config" ("category", "description", "locked", "name", "obscured", "order", "secret", "type", "updatedAt", "value") SELECT "category", "description", "locked", "name", "obscured", "order", "secret", "type", "updatedAt", "value" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;