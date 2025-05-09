/*
  Warnings:

  - A unique constraint covering the columns `[ldapDN]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "ldapDN" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_ldapDN_key" ON "User"("ldapDN");
