-- DropForeignKey
ALTER TABLE "StagingClient" DROP CONSTRAINT "StagingClient_identificationTypeCode_fkey";

-- AlterTable
ALTER TABLE "StagingClient" ALTER COLUMN "identificationTypeCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_identificationTypeCode_fkey" FOREIGN KEY ("identificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
