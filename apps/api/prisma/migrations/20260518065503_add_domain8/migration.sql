/*
  Warnings:

  - Added the required column `batchId` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contract_contractNo_key";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "batchId" TEXT NOT NULL,
ADD COLUMN     "branchCode" TEXT,
ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "contractEndActualDate" TIMESTAMP(3),
ADD COLUMN     "contractEndPlannedDate" TIMESTAMP(3),
ADD COLUMN     "contractPhase" TEXT DEFAULT 'AC',
ADD COLUMN     "contractRequestDate" TIMESTAMP(3),
ADD COLUMN     "contractStartDate" TIMESTAMP(3),
ADD COLUMN     "contractStatus" TEXT,
ADD COLUMN     "contractType" INTEGER DEFAULT 15,
ADD COLUMN     "currency" TEXT DEFAULT 'PHP',
ADD COLUMN     "financedAmount" DECIMAL(18,2),
ADD COLUMN     "firstPaymentDate" TIMESTAMP(3),
ADD COLUMN     "installmentsNumber" INTEGER,
ADD COLUMN     "lastPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3),
ADD COLUMN     "monthlyPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "nextPaymentAmount" DECIMAL(18,2),
ADD COLUMN     "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN     "originalCurrency" TEXT DEFAULT 'PHP',
ADD COLUMN     "outstandingBalance" DECIMAL(18,2),
ADD COLUMN     "outstandingPaymentNumber" INTEGER,
ADD COLUMN     "overduePaymentAmount" DECIMAL(18,2),
ADD COLUMN     "overduePaymentNumber" INTEGER,
ADD COLUMN     "paymentMethod" TEXT DEFAULT 'OTH',
ADD COLUMN     "paymentPeriodicity" TEXT DEFAULT 'M',
ADD COLUMN     "providerCode" TEXT DEFAULT 'PF007980',
ADD COLUMN     "providerSubjectNo" TEXT,
ADD COLUMN     "recordType" TEXT NOT NULL DEFAULT 'CI',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'B',
ADD COLUMN     "transactionType" TEXT DEFAULT 'NA',
ALTER COLUMN "contractNo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
