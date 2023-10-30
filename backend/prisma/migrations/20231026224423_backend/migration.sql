/*
  Warnings:

  - Added the required column `allowed` to the `RoomUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "allowed" BOOLEAN NOT NULL;
