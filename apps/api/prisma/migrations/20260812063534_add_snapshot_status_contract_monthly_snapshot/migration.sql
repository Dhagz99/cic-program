-- CreateEnum
CREATE TYPE "SnapshotStatus" AS ENUM ('DRAFT', 'VALIDATED', 'EXPORTED');

-- AlterTable
ALTER TABLE "ContractMonthlySnapshot" ADD COLUMN     "snapshotStatus" "SnapshotStatus" NOT NULL DEFAULT 'DRAFT';
