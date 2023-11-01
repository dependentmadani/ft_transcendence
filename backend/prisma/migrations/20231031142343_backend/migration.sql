/*
  Warnings:

  - A unique constraint covering the columns `[latestMsg]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latestMsg` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "latestMsg" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_latestMsg_key" ON "Chat"("latestMsg");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_latestMsg_fkey" FOREIGN KEY ("latestMsg") REFERENCES "Message"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;
