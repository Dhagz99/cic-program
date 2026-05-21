-- AlterTable
ALTER TABLE "StagingClient" ADD COLUMN     "addressConfidence" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "PSGCReference" (
    "id" TEXT NOT NULL,
    "regionName" TEXT,
    "provinceName" TEXT NOT NULL,
    "municipalityName" TEXT NOT NULL,
    "barangayName" TEXT NOT NULL,
    "zipCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PSGCReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PSGCReference_provinceName_idx" ON "PSGCReference"("provinceName");

-- CreateIndex
CREATE INDEX "PSGCReference_municipalityName_idx" ON "PSGCReference"("municipalityName");

-- CreateIndex
CREATE INDEX "PSGCReference_barangayName_idx" ON "PSGCReference"("barangayName");
