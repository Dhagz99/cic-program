-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "secondaryIdentificationNumber" TEXT,
ADD COLUMN     "secondaryIdentificationTypeCode" INTEGER;

-- AlterTable
ALTER TABLE "StagingClient" ADD COLUMN     "secondaryIdentificationNumber" TEXT,
ADD COLUMN     "secondaryIdentificationTypeCode" INTEGER;
