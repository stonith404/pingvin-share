-- CreateTable
CREATE TABLE "ReverseShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "shareExpiration" DATETIME NOT NULL,
    "maxShareSize" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "shareId" TEXT,
    CONSTRAINT "ReverseShare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReverseShare_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_token_key" ON "ReverseShare"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ReverseShare_shareId_key" ON "ReverseShare"("shareId");
