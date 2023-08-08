/*
  Warnings:

  - A unique constraint covering the columns `[twofaEmail]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Users_twofa_key";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "twoEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twofaEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_twofaEmail_key" ON "Users"("twofaEmail");
