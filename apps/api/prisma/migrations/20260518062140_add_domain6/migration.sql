/*
  Warnings:

  - You are about to drop the column `batchId` on the `Client` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_batchId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "batchId",
ADD COLUMN     "branchId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
