/*
  Warnings:

  - You are about to drop the column `tinNumber` on the `StagingClient` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('MI', 'AI');

-- AlterTable
ALTER TABLE "StagingClient" DROP COLUMN "tinNumber",
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "addressType" "AddressType" NOT NULL DEFAULT 'MI',
ADD COLUMN     "addressType2" "AddressType" NOT NULL DEFAULT 'AI',
ADD COLUMN     "branchCode" TEXT,
ADD COLUMN     "contactType" TEXT,
ADD COLUMN     "contactValue" TEXT,
ADD COLUMN     "countryOfBirthCode" TEXT DEFAULT 'PH',
ADD COLUMN     "identificationNumber" INTEGER,
ADD COLUMN     "identificationType" TEXT,
ADD COLUMN     "nationality" TEXT DEFAULT 'Filipino',
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "numberOfDependents" INTEGER DEFAULT 0,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "prevLastName" TEXT,
ADD COLUMN     "providerCode" TEXT,
ADD COLUMN     "recordType" TEXT NOT NULL DEFAULT 'ID',
ADD COLUMN     "subjectRefeerenceDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT;
