/*
  Warnings:

  - A unique constraint covering the columns `[branchId,providerSubjectNo]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_branchId_providerSubjectNo_key" ON "Client"("branchId", "providerSubjectNo");
