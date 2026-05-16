/*
  Warnings:

  - You are about to drop the column `civilStatus` on the `StagingClient` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `StagingClient` table. All the data in the column will be lost.
  - You are about to drop the column `identificationType` on the `StagingClient` table. All the data in the column will be lost.
  - Added the required column `civilStatusCode` to the `StagingClient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationTypeCode` to the `StagingClient` table without a default value. This is not possible if the table is not empty.
  - Made the column `birthDate` on table `StagingClient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numberOfDependents` on table `StagingClient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StagingClient" DROP COLUMN "civilStatus",
DROP COLUMN "gender",
DROP COLUMN "identificationType",
ADD COLUMN     "civilStatusCode" INTEGER NOT NULL,
ADD COLUMN     "genderCode" TEXT,
ADD COLUMN     "identificationTypeCode" INTEGER NOT NULL,
ALTER COLUMN "birthDate" SET NOT NULL,
ALTER COLUMN "numberOfDependents" SET NOT NULL;

-- CreateTable
CREATE TABLE "gender_domain" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "gender_domain_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "civil_status_domain" (
    "code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "civil_status_domain_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "identification_type_domain" (
    "code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "identification_type_domain_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_civilStatusCode_fkey" FOREIGN KEY ("civilStatusCode") REFERENCES "civil_status_domain"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_identificationTypeCode_fkey" FOREIGN KEY ("identificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "gender_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
