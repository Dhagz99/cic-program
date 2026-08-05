-- CreateTable
CREATE TABLE "PostalCodeReference" (
    "id" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "municipalityName" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "normalizedProvince" TEXT NOT NULL,
    "normalizedMunicipality" TEXT NOT NULL,
    "municipalityCode" TEXT,
    "source" TEXT NOT NULL DEFAULT 'PHLPOST',
    "sourceUrl" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "PostalCodeReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_idx" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality");

-- CreateIndex
CREATE INDEX "PostalCodeReference_municipalityCode_idx" ON "PostalCodeReference"("municipalityCode");

-- CreateIndex
CREATE INDEX "PostalCodeReference_zipCode_idx" ON "PostalCodeReference"("zipCode");

-- CreateIndex
CREATE UNIQUE INDEX "PostalCodeReference_normalizedProvince_normalizedMunicipali_key" ON "PostalCodeReference"("normalizedProvince", "normalizedMunicipality", "zipCode");
