-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "latestMessageContent" TEXT,
ADD COLUMN     "latestMessageDate" TIMESTAMP(3);
