/*
  Warnings:

  - A unique constraint covering the columns `[normalizedProvince,normalizedMunicipality,nomrmalizedPostalArea,zipCode]` on the table `PostalCodeReference` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_idx";

-- DropIndex
DROP INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_key";

-- AlterTable
ALTER TABLE "PostalCodeReference" ADD COLUMN     "nomrmalizedPostalArea" TEXT,
ADD COLUMN     "postalAreaName" TEXT,
ADD COLUMN     "postalAreaType" TEXT;

-- CreateIndex
CREATE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_idx" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality", "nomrmalizedPostalArea");

-- CreateIndex
CREATE UNIQUE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_key" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality", "nomrmalizedPostalArea", "zipCode");
