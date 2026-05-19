/*
  Warnings:

  - A unique constraint covering the columns `[branchId,contractNo]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contract_branchId_contractNo_key" ON "Contract"("branchId", "contractNo");
