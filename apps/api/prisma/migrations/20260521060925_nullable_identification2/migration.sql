-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_identificationTypeCode_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "birthDate" DROP NOT NULL,
ALTER COLUMN "identificationTypeCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_identificationTypeCode_fkey" FOREIGN KEY ("identificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
