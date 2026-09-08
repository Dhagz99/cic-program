import fs from "fs";
import path from "path";

import prisma from "../../../../lib/prisma";

import { parseDbfFile } from "../parser/dbfParser.service";

import { normalizeClient } from "../../normalizers/normalizeClient";
import { normalizeContract } from "../../normalizers/normalizeContract";

import { validateClient } from "../validation/clientValidation.service";
import { validateContract } from "../validation/contractValidation.service";


import {
   loadPSGCReferenceCache
} from "../address/addressReferenceCache.service";
import { getRawAddressFromDbfRow } from "../address/getRawAddressFromDbfRow";
import { resolveAddressFromPSGCCache } from "../address/resolveAddress.service";
import { buildStagingClientData, buildStagingContractData } from "../staging/buildStagingBulkData";
import { loadPreviousContractSnapshotCache } from "../../../snapshot/loadPreviousContractSnapshotCache.service";
import { applyRenewalPayments } from "../contract/applyRenewalPayments.service";


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


   console.time(
   "LOAD_PREVIOUS_CONTRACT_SNAPSHOTS"
);

const previousContractSnapshotCache =
   await loadPreviousContractSnapshotCache({
      branchId:
         user.branchId,

      reportingPeriodId,
   });

console.timeEnd(
   "LOAD_PREVIOUS_CONTRACT_SNAPSHOTS"
);

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

 
   const clientMap =
      new Map<string, any>();

   const contractsTemp: any[] = [];

   const previewClients: any[] = [];
   const previewContracts: any[] = [];

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

      const providerSubjectNo =
         String(row.ID);

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

   const contractNo =
      row.ACCTNO
         ? String(
              row.ACCTNO
           ).trim()
         : null;


   const previousOutstandingBalance =
         contractNo
            ? previousContractSnapshotCache.get(
               contractNo
            ) ?? null
            : null;

const hasPreviousSnapshot =
   previousOutstandingBalance !== null;


   const normalizedContract =
      normalizeContract(
         row,
         previousOutstandingBalance
      );

      const clientValidationErrors =
         validateClient(normalizedClient);

      const contractValidationErrors =
         validateContract(normalizedContract);

      /**
       * Save client only once per DBF ID
       */
      if (!clientMap.has(providerSubjectNo)) {
         clientMap.set(providerSubjectNo, {
            rowNo,
            providerSubjectNo,
            client:
               normalizedClient,
            validationErrors:
               clientValidationErrors
         });

         if (previewClients.length < 5) {
            previewClients.push(
               normalizedClient
            );
         }
      }

      /**
       * Save every contract row
       */
      contractsTemp.push({
         rowNo,
         providerSubjectNo,
         contract:
            normalizedContract,
         validationErrors:
            contractValidationErrors,
         hasPreviousSnapshot,
      });





      if (previewContracts.length < 5) {
         previewContracts.push(
            normalizedContract
         );
      }
   }

   applyRenewalPayments(
      contractsTemp
   );



   const clientsTemp =
      Array.from(
         clientMap.values()
      );

   let completedRecords = 0;
   let errorRecords = 0;

   for (const contractItem of contractsTemp) {
      const clientItem =
         clientMap.get(
            contractItem.providerSubjectNo
         );

      const totalErrors =
         (clientItem?.validationErrors.length ?? 0) +
         contractItem.validationErrors.length;

      if (totalErrors > 0) {
         errorRecords++;
      } else {
         completedRecords++;
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
                     providerSubjectNo:
                        true
                  }
               });

            const clientIdByProviderSubjectNo =
               new Map(
                  createdClients.map((client) => [
                     client.providerSubjectNo,
                     client.id
                  ])
               );

            const contractsToCreate =
               contractsTemp.map((item) => {
                  const stagingClientId =
                     clientIdByProviderSubjectNo.get(
                        item.providerSubjectNo
                     );

                  if (!stagingClientId) {
                     throw new Error(
                        `Missing staging client for subject ${item.providerSubjectNo}`
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
                  clientIdByProviderSubjectNo.get(
                     item.providerSubjectNo
                  );

               if (!stagingClientId) {
                  continue;
               }

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

               if (!stagingContractId) {
                  continue;
               }

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

      totalRecords:
         records.length,

      totalClients:
         clientsTemp.length,

      totalContracts:
         contractsTemp.length,

      completedRecords,

      errorRecords,

      previewClients,

      previewContracts
   };
};