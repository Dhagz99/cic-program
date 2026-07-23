-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_batchId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "dailyBatchId" TEXT,
ALTER COLUMN "batchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_dailyBatchId_fkey" FOREIGN KEY ("dailyBatchId") REFERENCES "DailyImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
