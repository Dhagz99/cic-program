/*
  Warnings:

  - Added the required column `branchId` to the `ContractMonthlySnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractMonthlySnapshot" ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "lastPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "monthlyPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "nextPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN     "outstandingPaymentNumber" INTEGER,
ADD COLUMN     "overduePaymentAmount" DECIMAL(18,2),
ADD COLUMN     "overduePaymentNumber" INTEGER;

-- CreateIndex
CREATE INDEX "ContractMonthlySnapshot_branchId_reportingPeriodId_idx" ON "ContractMonthlySnapshot"("branchId", "reportingPeriodId");

-- AddForeignKey
ALTER TABLE "ContractMonthlySnapshot" ADD CONSTRAINT "ContractMonthlySnapshot_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
