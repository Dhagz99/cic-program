-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "addressBarangay" TEXT,
ADD COLUMN     "addressCity" TEXT,
ADD COLUMN     "addressCountry" TEXT DEFAULT 'PH',
ADD COLUMN     "addressPostalCode" TEXT,
ADD COLUMN     "addressProvince" TEXT,
ADD COLUMN     "addressStreetNo" TEXT,
ADD COLUMN     "addressSubdivision" TEXT;

-- AlterTable
ALTER TABLE "StagingClient" ADD COLUMN     "addressBarangay" TEXT,
ADD COLUMN     "addressCity" TEXT,
ADD COLUMN     "addressCountry" TEXT DEFAULT 'PH',
ADD COLUMN     "addressPostalCode" TEXT,
ADD COLUMN     "addressProvince" TEXT,
ADD COLUMN     "addressStreetNo" TEXT,
ADD COLUMN     "addressSubdivision" TEXT;
