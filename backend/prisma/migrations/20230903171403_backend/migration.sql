-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RelationStatus" AS ENUM ('MUTED_UNTIL_TOMMORROW', 'BLOCKED', 'NORMAL');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'MESSAGE', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "Users" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "hashRt" TEXT,
    "twofa" TEXT,
    "twofaEmail" TEXT,
    "twoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "userStatus" "userStatus" NOT NULL DEFAULT 'OFFLINE',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "socketId" TEXT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "banUser" BOOLEAN NOT NULL,
    "muteUser" BOOLEAN NOT NULL,
    "gameInvite" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blockedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_twofaEmail_key" ON "Users"("twofaEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blockedUsers_AB_unique" ON "_blockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_blockedUsers_B_index" ON "_blockedUsers"("B");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockedUsers" ADD CONSTRAINT "_blockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockedUsers" ADD CONSTRAINT "_blockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
