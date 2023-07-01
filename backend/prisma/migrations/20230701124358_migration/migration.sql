-- CreateTable
CREATE TABLE "ReverseShareOptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareId" TEXT NOT NULL,
    "easyMode" BOOLEAN NOT NULL,
    "customLinkEnabled" BOOLEAN NOT NULL,
    "passwordEnabled" BOOLEAN NOT NULL,
    "descriptionEnabled" BOOLEAN NOT NULL,
    "maximalViewsEnabled" BOOLEAN NOT NULL,
    CONSTRAINT "ReverseShareOptions_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "ReverseShare" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShareOptions_shareId_key" ON "ReverseShareOptions"("shareId");

-- Insert a ReverseShareOptions for each ReverseShare
INSERT INTO "ReverseShareOptions" ("shareId", "easyMode", "customLinkEnabled", "passwordEnabled", "descriptionEnabled", "maximalViewsEnabled")
SELECT id, 0, 1, 1, 1, 1 FROM "ReverseShare";

