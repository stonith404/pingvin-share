-- CreateTable
CREATE TABLE "ReverseShareOptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareId" TEXT NOT NULL,
    "easyMode" BOOLEAN NOT NULL DEFAULT false,
    "customLinkEnabled" BOOLEAN NOT NULL DEFAULT true,
    "passwordEnabled" BOOLEAN NOT NULL DEFAULT true,
    "descriptionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maximalViewsEnabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ReverseShareOptions_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "ReverseShare" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShareOptions_shareId_key" ON "ReverseShareOptions"("shareId");
