-- DropForeignKey
ALTER TABLE "StagingClient" DROP CONSTRAINT "StagingClient_civilStatusCode_fkey";

-- AlterTable
ALTER TABLE "StagingClient" ALTER COLUMN "civilStatusCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_civilStatusCode_fkey" FOREIGN KEY ("civilStatusCode") REFERENCES "civil_status_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
