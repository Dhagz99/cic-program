/*
  Warnings:

  - Added the required column `importBatchId` to the `CicExport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CicExport" ADD COLUMN     "importBatchId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CicExport" ADD CONSTRAINT "CicExport_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
