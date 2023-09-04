/*
  Warnings:

  - The values [ERROR] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('INFO', 'MESSAGE', 'FRIEND', 'GAME');
ALTER TABLE "Notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- CreateTable
CREATE TABLE "_PendingFriend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PendingFriend_AB_unique" ON "_PendingFriend"("A", "B");

-- CreateIndex
CREATE INDEX "_PendingFriend_B_index" ON "_PendingFriend"("B");

-- AddForeignKey
ALTER TABLE "_PendingFriend" ADD CONSTRAINT "_PendingFriend_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PendingFriend" ADD CONSTRAINT "_PendingFriend_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
