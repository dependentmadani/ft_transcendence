/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `banUser` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `blocked_user` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `gameInvite` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `muteUser` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_recId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_senId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
DROP COLUMN "banUser",
DROP COLUMN "blocked_user",
DROP COLUMN "createdAt",
DROP COLUMN "gameInvite",
DROP COLUMN "id",
DROP COLUMN "muteUser",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "contactId" SERIAL NOT NULL,
ADD COLUMN     "msg" TEXT,
ADD COLUMN     "recId" INTEGER NOT NULL,
ADD COLUMN     "senId" INTEGER NOT NULL,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("contactId");

-- DropTable
DROP TABLE "Contact";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_senId_fkey" FOREIGN KEY ("senId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_recId_fkey" FOREIGN KEY ("recId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
