import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";
import { parseDbfFile } from "../../cic/services/parser/dbfParser.service";
import { loadPSGCReferenceCache } from "../../cic/services/address/addressReferenceCache.service";
import { getRawAddressFromDbfRow } from "../../cic/services/address/getRawAddressFromDbfRow";
import { resolveAddressFromPSGCCache } from "../../cic/services/address/resolveAddress.service";
import { normalizeClient } from "../../cic/normalizers/normalizeClient";
import { validateClient } from "../../cic/services/validation/clientValidation.service";
import { buildDailyStagingClientData, buildStagingClientData } from "../../cic/services/staging/buildStagingBulkData";


export const uploadDailyDbfService = async ({
   file,
   user
}: any) => {


   const uploadDir =
      path.join(
         process.cwd(),
         "uploads",
         "cic",
         String(2026),
         String(7),
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


   const previewClients: any[] = [];

   const resolvedAddressCache =
      new Map<string, any>();


const providerSubjectNos = records
      .map((row) => String(row.ID))
      .filter(
         (id) => id && id !== "-1"
      );


const existingClients =
  await prisma.client.findMany({
    where: {
      branchId: user.branchId,

      providerSubjectNo: {
        in: providerSubjectNos
      }
    },

    select: {
      providerSubjectNo: true
    }
  });

const existingProviderSubjectNos =
   new Set(
      existingClients.map(
         (client) => client.providerSubjectNo
      )
   );
   let skippedExistingClients = 0;

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


      const clientValidationErrors =
         validateClient(normalizedClient);
    

      /**
       * Save client only once per DBF ID
       */


        if (
        providerSubjectNo !== "-1" &&
        existingProviderSubjectNos.has(providerSubjectNo)
        ) {
        // Already exists in Client table.
        skippedExistingClients++;
        continue;
        }


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
     
   }

   const clientsTemp =
      Array.from(
         clientMap.values()
      );

   let completedRecords = 0;
   let errorRecords = 0;


   console.timeEnd("NORMALIZE_VALIDATE");

   console.time("DATABASE");

   const result =
      await prisma.$transaction(
         async (tx) => {
            const batch = await tx.dailyImportBatch.create({
                data: {
                  branchId: user.branchId,
              
                  createdBy: {
                    connect: {
                      id: user.id,
                    },
                  },
              
                  fileName: file.originalname,
              
                  totalRecords: records.length,
                  completedRecords,
                  errorRecords,
              
                  status: "PENDING",
                },
              });

            const clientsToCreate =
               clientsTemp.map((item) =>
                  buildDailyStagingClientData({
                    dailyId:
                        batch.id,

                     rowNo:
                        item.rowNo,

                     client:
                        item.client,

                     validationErrors:
                        item.validationErrors
                  })
               );

            await tx.dailyStagingClient.createMany({
               data:
                  clientsToCreate
            });

            const createdClients =
               await tx.dailyStagingClient.findMany({
                  where: {
                     dailyId:
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
          
            const validationErrorsToCreate: {
            dailyStagingClientId: string;
            fieldName: string;
            errorMessage: string;
            }[] = [];

            for (const item of clientsTemp) {
               const dailyStagingClientId =
                  clientIdByProviderSubjectNo.get(
                     item.providerSubjectNo
                  );

               if (!dailyStagingClientId) {
                  continue;
               }

               for (const err of item.validationErrors) {
                  validationErrorsToCreate.push({
                    dailyStagingClientId,

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
               await tx.dailyImportBatch.update({
                  where: {
                     id:
                        batch.id
                  },
                  data: {
                     status:
                        "PROCESSING"
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

     skippedExistingClients,

      totalClients:
         clientsTemp.length,
  
      completedRecords,

      errorRecords,

      previewClients,

     
   };
};