-- DropForeignKey
ALTER TABLE "CicExport" DROP CONSTRAINT "CicExport_importBatchId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_batchId_fkey";

-- DropForeignKey
ALTER TABLE "StagingClient" DROP CONSTRAINT "StagingClient_batchId_fkey";

-- DropForeignKey
ALTER TABLE "StagingContract" DROP CONSTRAINT "StagingContract_batchId_fkey";

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingContract" ADD CONSTRAINT "StagingContract_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CicExport" ADD CONSTRAINT "CicExport_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
