-- CreateEnum
CREATE TYPE "DailyBatchStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "ValidationError" ADD COLUMN     "dailyStagingClientId" TEXT;

-- CreateTable
CREATE TABLE "DailyImportBatch" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "fileName" TEXT,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "completedRecords" INTEGER NOT NULL DEFAULT 0,
    "errorRecords" INTEGER NOT NULL DEFAULT 0,
    "status" "DailyBatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStagingClient" (
    "id" TEXT NOT NULL,
    "recordType" TEXT NOT NULL DEFAULT 'ID',
    "dailyId" TEXT NOT NULL,
    "rowNo" INTEGER NOT NULL,
    "providerCode" TEXT DEFAULT 'PF007980',
    "branchCode" TEXT,
    "subjectRefeerenceDate" TIMESTAMP(3),
    "providerSubjectNo" TEXT,
    "title" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "suffix" TEXT,
    "nickname" TEXT,
    "prevLastName" TEXT,
    "genderCode" TEXT,
    "birthDate" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "countryOfBirthCode" TEXT DEFAULT 'PH',
    "nationality" TEXT DEFAULT 'PH',
    "resident" BOOLEAN DEFAULT true,
    "civilStatusCode" INTEGER,
    "numberOfDependents" INTEGER NOT NULL DEFAULT 0,
    "addressType" "AddressType" NOT NULL DEFAULT 'MI',
    "address" TEXT,
    "addressStreetNo" TEXT,
    "addressPostalCode" TEXT,
    "addressSubdivision" TEXT,
    "addressBarangay" TEXT,
    "addressCity" TEXT,
    "addressProvince" TEXT,
    "addressCountry" TEXT DEFAULT 'PH',
    "addressType2" "AddressType" NOT NULL DEFAULT 'AI',
    "address2" TEXT,
    "identificationTypeCode" INTEGER,
    "identificationNumber" TEXT,
    "secondaryIdentificationTypeCode" INTEGER,
    "secondaryIdentificationNumber" TEXT,
    "contactType" TEXT,
    "contactValue" TEXT,
    "addressConfidence" DECIMAL(5,2),
    "validationStatus" "ValidationStatus" NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyStagingClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyStagingClient_dailyId_rowNo_key" ON "DailyStagingClient"("dailyId", "rowNo");

-- AddForeignKey
ALTER TABLE "ValidationError" ADD CONSTRAINT "ValidationError_dailyStagingClientId_fkey" FOREIGN KEY ("dailyStagingClientId") REFERENCES "DailyStagingClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyImportBatch" ADD CONSTRAINT "DailyImportBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStagingClient" ADD CONSTRAINT "DailyStagingClient_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "DailyImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStagingClient" ADD CONSTRAINT "DailyStagingClient_civilStatusCode_fkey" FOREIGN KEY ("civilStatusCode") REFERENCES "civil_status_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStagingClient" ADD CONSTRAINT "DailyStagingClient_identificationTypeCode_fkey" FOREIGN KEY ("identificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStagingClient" ADD CONSTRAINT "DailyStagingClient_secondaryIdentificationTypeCode_fkey" FOREIGN KEY ("secondaryIdentificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStagingClient" ADD CONSTRAINT "DailyStagingClient_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "gender_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
