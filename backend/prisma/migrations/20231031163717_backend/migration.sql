/*
  Warnings:

  - You are about to drop the column `latestMsg` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_latestMsg_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "latestMsg",
ADD COLUMN     "latestMessageContent" TEXT,
ADD COLUMN     "latestMessageDate" TIMESTAMP(3);
