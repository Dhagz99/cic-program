-- AlterTable
ALTER TABLE "StagingClient" ADD COLUMN     "resident" BOOLEAN DEFAULT true,
ALTER COLUMN "nationality" SET DEFAULT 'PH',
ALTER COLUMN "providerCode" SET DEFAULT 'PF007980';
