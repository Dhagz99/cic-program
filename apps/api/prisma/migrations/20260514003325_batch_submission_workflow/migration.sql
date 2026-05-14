-- AlterEnum
ALTER TYPE "ImportStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "ImportBatch" ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedById" INTEGER,
ADD COLUMN     "rejectionReason" TEXT;

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
