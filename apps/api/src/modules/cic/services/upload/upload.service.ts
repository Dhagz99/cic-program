import fs from "fs";
import path from "path";

import prisma from "../../../../lib/prisma";

import { parseDbfFile } from "../parser/dbfParser.service";

import { normalizeClient } from "../../normalizers/normalizeClient";
import { normalizeContract } from "../../normalizers/normalizeContract";

import { validateClient } from "../validation/clientValidation.service";
import { validateContract } from "../validation/contractValidation.service";



import { loadPSGCReferenceCache } from "../address/addressReferenceCache.service";
import { getRawAddressFromDbfRow } from "../address/getRawAddressFromDbfRow";
import { resolveAddressFromPSGCCache } from "../address/resolveAddress.service";
import { buildStagingClientData, buildStagingContractData } from "../staging/buildStagingBulkData";


export const uploadDbfService = async ({
   file,
   reportingPeriodId,
   user
}: any) => {
   const reportingPeriod =
      await prisma.reportingPeriod.findFirst({
         where: {
            id: reportingPeriodId,
            status: "OPEN"
         }
      });

   if (!reportingPeriod) {
      throw new Error("Invalid or closed reporting period");
   }

   const existingBatch =
      await prisma.importBatch.findFirst({
         where: {
            branchId: user.branchId,
            reportingPeriodId
         }
      });

   if (existingBatch) {
      throw new Error("Branch already uploaded");
   }

   const uploadDir =
      path.join(
         process.cwd(),
         "uploads",
         "cic",
         String(reportingPeriod.year),
         String(reportingPeriod.month),
         String(user.branchId)
      );

   fs.mkdirSync(uploadDir, {
      recursive: true
   });

   const finalPath =
      path.join(
         uploadDir,
         file.originalname
      );

   fs.renameSync(
      file.path,
      finalPath
   );

   console.time("PARSE_DBF");

   const records =
      await parseDbfFile(finalPath);

   console.timeEnd("PARSE_DBF");

   console.time("LOAD_PSGC_CACHE");

   const psgcCache =
      await loadPSGCReferenceCache();

   console.timeEnd("LOAD_PSGC_CACHE");

   console.time("NORMALIZE_VALIDATE");

   let completedRecords = 0;
   let errorRecords = 0;

   const previewClients: any[] = [];
   const previewContracts: any[] = [];

   const clientsTemp: any[] = [];
   const contractsTemp: any[] = [];

   const resolvedAddressCache =
      new Map<string, any>();

   for (
      let index = 0;
      index < records.length;
      index++
   ) {
      const row =
         records[index];

      const rowNo =
         index + 1;

      const rawAddress =
         getRawAddressFromDbfRow(row);

      let resolvedAddress =
         resolvedAddressCache.get(rawAddress);

      if (!resolvedAddress) {
         resolvedAddress =
            resolveAddressFromPSGCCache(
               rawAddress,
               psgcCache
            );

         resolvedAddressCache.set(
            rawAddress,
            resolvedAddress
         );
      }

      const normalizedClient =
         normalizeClient(
            row,
            resolvedAddress
         );

      const normalizedContract =
         normalizeContract(row);

      const clientValidationErrors =
         validateClient(normalizedClient);

      const contractValidationErrors =
         validateContract(normalizedContract);

      const totalErrors =
         clientValidationErrors.length +
         contractValidationErrors.length;

      if (totalErrors > 0) {
         errorRecords++;
      } else {
         completedRecords++;
      }

      clientsTemp.push({
         rowNo,
         client:
            normalizedClient,
         validationErrors:
            clientValidationErrors
      });

      contractsTemp.push({
         rowNo,
         contract:
            normalizedContract,
         validationErrors:
            contractValidationErrors
      });

      if (previewClients.length < 5) {
         previewClients.push(
            normalizedClient
         );
      }

      if (previewContracts.length < 5) {
         previewContracts.push(
            normalizedContract
         );
      }
   }

   console.timeEnd("NORMALIZE_VALIDATE");

   console.time("DATABASE");

   const result =
      await prisma.$transaction(
         async (tx) => {
            const batch =
               await tx.importBatch.create({
                  data: {
                     branchId:
                        user.branchId,

                     reportingPeriodId,

                     uploadedById:
                        user.id,

                     fileName:
                        file.originalname,

                     originalFilePath:
                        finalPath,

                     totalRecords:
                        records.length,

                     completedRecords,

                     errorRecords,

                     status:
                        "PROCESSING"
                  }
               });

            const clientsToCreate =
               clientsTemp.map((item) =>
                  buildStagingClientData({
                     batchId:
                        batch.id,

                     rowNo:
                        item.rowNo,

                     client:
                        item.client,

                     validationErrors:
                        item.validationErrors
                  })
               );

            await tx.stagingClient.createMany({
               data:
                  clientsToCreate
            });

            const createdClients =
               await tx.stagingClient.findMany({
                  where: {
                     batchId:
                        batch.id
                  },
                  select: {
                     id:
                        true,
                     rowNo:
                        true
                  }
               });

            const clientIdByRowNo =
               new Map(
                  createdClients.map((client) => [
                     client.rowNo,
                     client.id
                  ])
               );

            const contractsToCreate =
               contractsTemp.map((item) => {
                  const stagingClientId =
                     clientIdByRowNo.get(
                        item.rowNo
                     );

                  if (!stagingClientId) {
                     throw new Error(
                        `Missing staging client for row ${item.rowNo}`
                     );
                  }

                  return buildStagingContractData({
                     batchId:
                        batch.id,

                     stagingClientId,

                     rowNo:
                        item.rowNo,

                     contract:
                        item.contract,

                     validationErrors:
                        item.validationErrors
                  });
               });

            await tx.stagingContract.createMany({
               data:
                  contractsToCreate
            });

            const createdContracts =
               await tx.stagingContract.findMany({
                  where: {
                     batchId:
                        batch.id
                  },
                  select: {
                     id:
                        true,
                     rowNo:
                        true
                  }
               });

            const contractIdByRowNo =
               new Map(
                  createdContracts.map((contract) => [
                     contract.rowNo,
                     contract.id
                  ])
               );

            const validationErrorsToCreate: any[] = [];

            for (const item of clientsTemp) {
               const stagingClientId =
                  clientIdByRowNo.get(
                     item.rowNo
                  );

               for (const err of item.validationErrors) {
                  validationErrorsToCreate.push({
                     stagingClientId,

                     fieldName:
                        err.fieldName,

                     errorMessage:
                        err.errorMessage
                  });
               }
            }

            for (const item of contractsTemp) {
               const stagingContractId =
                  contractIdByRowNo.get(
                     item.rowNo
                  );

               for (const err of item.validationErrors) {
                  validationErrorsToCreate.push({
                     stagingContractId,

                     fieldName:
                        err.fieldName,

                     errorMessage:
                        err.errorMessage
                  });
               }
            }

            if (validationErrorsToCreate.length > 0) {
               await tx.validationError.createMany({
                  data:
                     validationErrorsToCreate
               });
            }

            const updatedBatch =
               await tx.importBatch.update({
                  where: {
                     id:
                        batch.id
                  },
                  data: {
                     status:
                        "PENDING_COMPLETION"
                  }
               });

            return updatedBatch;
         },
         {
            timeout:
               60000
         }
      );

   console.timeEnd("DATABASE");

   return {
      message:
         "DBF uploaded successfully",

      batchId:
         result.id,

      totalClients:
         records.length,

      totalContracts:
         records.length,

      completedRecords,

      errorRecords,

      previewClients,

      previewContracts
   };
};