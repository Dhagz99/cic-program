/*
  Warnings:

  - A unique constraint covering the columns `[batchId,rowNo]` on the table `StagingClient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[batchId,rowNo]` on the table `StagingContract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rowNo` to the `StagingClient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rowNo` to the `StagingContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StagingClient" ADD COLUMN     "rowNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StagingContract" ADD COLUMN     "rowNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StagingClient_batchId_rowNo_key" ON "StagingClient"("batchId", "rowNo");

-- CreateIndex
CREATE UNIQUE INDEX "StagingContract_batchId_rowNo_key" ON "StagingContract"("batchId", "rowNo");
