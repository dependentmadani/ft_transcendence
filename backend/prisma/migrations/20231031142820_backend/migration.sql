-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_latestMsg_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "latestMsg" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_latestMsg_fkey" FOREIGN KEY ("latestMsg") REFERENCES "Message"("messageId") ON DELETE SET NULL ON UPDATE CASCADE;
