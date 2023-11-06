/*
  Warnings:

  - You are about to drop the column `description` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `socketId` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "socketId",
DROP COLUMN "title",
ADD COLUMN     "mode" TEXT;
