/*
  Warnings:

  - You are about to drop the column `contractEndDate` on the `StagingContract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StagingContract" DROP COLUMN "contractEndDate",
ADD COLUMN     "branchCode" TEXT,
ADD COLUMN     "contractEndActualDate" TIMESTAMP(3),
ADD COLUMN     "contractEndPlannedDate" TIMESTAMP(3),
ADD COLUMN     "contractPhase" TEXT DEFAULT 'AC',
ADD COLUMN     "contractRequestDate" TIMESTAMP(3),
ADD COLUMN     "contractType" INTEGER DEFAULT 15,
ADD COLUMN     "currency" TEXT DEFAULT 'PHP',
ADD COLUMN     "firstPaymentDate" TIMESTAMP(3),
ADD COLUMN     "installmentsNumber" INTEGER,
ADD COLUMN     "lastPaymentAmount" DECIMAL(18,2),
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
ADD COLUMN     "recordType" TEXT NOT NULL DEFAULT 'CI',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'B',
ADD COLUMN     "transactionType" TEXT DEFAULT 'NA';
