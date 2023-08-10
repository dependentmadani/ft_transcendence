/*
  Warnings:

  - A unique constraint covering the columns `[twofa]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "twofa" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_twofa_key" ON "Users"("twofa");
