-- CreateEnum
CREATE TYPE "PenType" AS ENUM ('SD', 'EC', 'RT');

-- CreateTable
CREATE TABLE "CicData" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "inDate" DATE,
    "accountPension" DECIMAL(10,2),
    "pension" DECIMAL(10,2) NOT NULL,
    "branch" TEXT NOT NULL,
    "change" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "balanceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "pentionType" "PenType" NOT NULL,
    "mark" BOOLEAN NOT NULL DEFAULT false,
    "balanceTerm" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CicData_pkey" PRIMARY KEY ("id")
);
