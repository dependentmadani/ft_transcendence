-- CreateTable
CREATE TABLE "Contact" (
    "contactId" SERIAL NOT NULL,
    "senId" INTEGER NOT NULL,
    "recId" INTEGER NOT NULL,
    "msg" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contactId")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_senId_fkey" FOREIGN KEY ("senId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_recId_fkey" FOREIGN KEY ("recId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
