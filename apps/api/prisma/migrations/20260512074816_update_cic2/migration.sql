/*
  Warnings:

  - You are about to drop the column `accountPension` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `balanceAmount` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `balanceTerm` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `change` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `inDate` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `mark` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `pension` on the `CicData` table. All the data in the column will be lost.
  - You are about to drop the column `pentionType` on the `CicData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CicData" DROP COLUMN "accountPension",
DROP COLUMN "balanceAmount",
DROP COLUMN "balanceTerm",
DROP COLUMN "bank",
DROP COLUMN "birthDate",
DROP COLUMN "branch",
DROP COLUMN "change",
DROP COLUMN "inDate",
DROP COLUMN "mark",
DROP COLUMN "pension",
DROP COLUMN "pentionType";
