/*
  Warnings:

  - You are about to drop the column `branchId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `civilStatus` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `tinNumber` on the `Client` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationTypeCode` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `birthDate` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_branchId_fkey";

-- DropIndex
DROP INDEX "Client_providerSubjectNo_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "branchId",
DROP COLUMN "civilStatus",
DROP COLUMN "gender",
DROP COLUMN "tinNumber",
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "addressType" "AddressType" NOT NULL DEFAULT 'MI',
ADD COLUMN     "addressType2" "AddressType" NOT NULL DEFAULT 'AI',
ADD COLUMN     "batchId" TEXT NOT NULL,
ADD COLUMN     "branchCode" TEXT,
ADD COLUMN     "civilStatusCode" INTEGER,
ADD COLUMN     "contactType" TEXT,
ADD COLUMN     "contactValue" TEXT,
ADD COLUMN     "countryOfBirthCode" TEXT DEFAULT 'PH',
ADD COLUMN     "genderCode" TEXT,
ADD COLUMN     "identificationNumber" TEXT,
ADD COLUMN     "identificationTypeCode" INTEGER NOT NULL,
ADD COLUMN     "nationality" TEXT DEFAULT 'PH',
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "numberOfDependents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "prevLastName" TEXT,
ADD COLUMN     "providerCode" TEXT DEFAULT 'PF007980',
ADD COLUMN     "recordType" TEXT NOT NULL DEFAULT 'ID',
ADD COLUMN     "resident" BOOLEAN DEFAULT true,
ADD COLUMN     "subjectRefeerenceDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "birthDate" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_civilStatusCode_fkey" FOREIGN KEY ("civilStatusCode") REFERENCES "civil_status_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_identificationTypeCode_fkey" FOREIGN KEY ("identificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "gender_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
