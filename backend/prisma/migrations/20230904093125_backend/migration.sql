/*
  Warnings:

  - Made the column `socketId` on table `Notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "socketId" SET NOT NULL;
