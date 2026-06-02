-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('Success', 'Pending', 'Reject');

-- CreateTable
CREATE TABLE "CicExport" (
    "id" TEXT NOT NULL,
    "reportingPeriodId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "generatedById" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "status" "ExportStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CicExport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CicExport" ADD CONSTRAINT "CicExport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CicExport" ADD CONSTRAINT "CicExport_reportingPeriodId_fkey" FOREIGN KEY ("reportingPeriodId") REFERENCES "ReportingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CicExport" ADD CONSTRAINT "CicExport_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
