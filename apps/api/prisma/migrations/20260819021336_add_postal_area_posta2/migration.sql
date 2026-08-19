/*
  Warnings:

  - You are about to drop the column `nomrmalizedPostalArea` on the `PostalCodeReference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[normalizedProvince,normalizedMunicipality,normalizedPostalArea,zipCode]` on the table `PostalCodeReference` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_idx";

-- DropIndex
DROP INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_key";

-- AlterTable
ALTER TABLE "PostalCodeReference" DROP COLUMN "nomrmalizedPostalArea",
ADD COLUMN     "normalizedPostalArea" TEXT;

-- CreateIndex
CREATE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_idx" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality", "normalizedPostalArea");

-- CreateIndex
CREATE UNIQUE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_key" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality", "normalizedPostalArea", "zipCode");
