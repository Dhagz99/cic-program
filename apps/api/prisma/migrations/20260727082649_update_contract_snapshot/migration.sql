-- AlterTable
ALTER TABLE "ContractMonthlySnapshot" ADD COLUMN     "contractEndActualDate" TIMESTAMP(3),
ADD COLUMN     "contractPhase" TEXT,
ADD COLUMN     "outstandingBalance" DECIMAL(18,2);
