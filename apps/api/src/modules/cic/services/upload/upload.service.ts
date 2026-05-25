import fs from "fs";

import path from "path";


import {
   parseDbfFile
} from "../parser/dbfParser.service";

import {
   normalizeClient
} from "../../normalizers/normalizeClient";

import {
   normalizeContract
} from "../../normalizers/normalizeContract";

import {
   validateClient
} from "../validation/clientValidation.service";

import {
   validateContract
} from "../validation/contractValidation.service";

import {
   saveStagingClient
} from "../staging/stagingClient.service";

import {
   saveStagingContract
} from "../staging/stagingContract.service";
import prisma from "../../../../lib/prisma";

export const uploadDbfService = async ({
   file,
   reportingPeriodId,
   user
}: any) => {

   /*
   --------------------------------
   VALIDATE REPORTING PERIOD
   --------------------------------
   */

   const reportingPeriod =
      await prisma.reportingPeriod.findFirst({
         where: {
            id: reportingPeriodId,
            status: "OPEN"
         }
      });

   if (!reportingPeriod) {

      throw new Error(
         "Invalid or closed reporting period"
      );

   }

   /*
   --------------------------------
   CHECK DUPLICATE UPLOAD
   --------------------------------
   */

   const existingBatch =
      await prisma.importBatch.findFirst({
         where: {
            branchId: user.branchId,
            reportingPeriodId
         }
      });

   if (existingBatch) {

      throw new Error(
         "Branch already uploaded"
      );

   }

   /*
   --------------------------------
   CREATE STORAGE DIRECTORY
   --------------------------------
   */

   const uploadDir = path.join(
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

   /*
   --------------------------------
   STORE ORIGINAL FILE
   --------------------------------
   */

   const finalPath = path.join(
      uploadDir,
      file.originalname
   );

   fs.renameSync(
      file.path,
      finalPath
   );

   /*
   --------------------------------
   CREATE IMPORT BATCH
   --------------------------------
   */

   const batch =
      await prisma.importBatch.create({
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

            status:
               "PROCESSING"
         }
      });

   /*
   --------------------------------
   PARSE DBF
   --------------------------------
   */

   const records =
      await parseDbfFile(
         finalPath
      );

   /*
   --------------------------------
   PROCESS RECORDS
   --------------------------------
   */

   let totalClients = 0;
   let totalContracts = 0;

   let completedRecords = 0;
   let errorRecords = 0;

   const previewClients = [];
   const previewContracts = [];

   for (const row of records) {

      /*
      -----------------------------
      NORMALIZE
      -----------------------------
      */

      const normalizedClient =
       await  normalizeClient(row);

      const normalizedContract =
         normalizeContract(row);

      /*
      -----------------------------
      VALIDATE CLIENT
      -----------------------------
      */

      const clientValidationErrors =
         validateClient(
            normalizedClient
         );

      /*
      -----------------------------
      SAVE STAGING CLIENT
      -----------------------------
      */

      const stagingClient =
         await saveStagingClient({

            batchId:
               batch.id,

            client:
               normalizedClient,

            validationErrors:
               clientValidationErrors
         });

      /*
      -----------------------------
      VALIDATE CONTRACT
      -----------------------------
      */

      const contractValidationErrors =
         validateContract(
            normalizedContract
         );

      /*
      -----------------------------
      SAVE STAGING CONTRACT
      -----------------------------
      */

      await saveStagingContract({

         batchId:
            batch.id,

         stagingClientId:
            stagingClient.id,

         contract:
            normalizedContract,

         validationErrors:
            contractValidationErrors
      });

      /*
      -----------------------------
      COUNTS
      -----------------------------
      */

      totalClients++;
      totalContracts++;

      const totalErrors =
         clientValidationErrors.length +
         contractValidationErrors.length;

      if (totalErrors > 0) {

         errorRecords++;

      } else {

         completedRecords++;

      }

      /*
      -----------------------------
      PREVIEW
      -----------------------------
      */

      if (
         previewClients.length < 5
      ) {

         previewClients.push(
            normalizedClient
         );

      }

      if (
         previewContracts.length < 5
      ) {

         previewContracts.push(
            normalizedContract
         );

      }

   }

   /*
   --------------------------------
   UPDATE IMPORT BATCH
   --------------------------------
   */

   await prisma.importBatch.update({
      where: {
         id: batch.id
      },

      data: {

         totalRecords:
            totalClients,

         completedRecords,

         errorRecords,

         status:
            "PENDING_COMPLETION"
      }
   });

   /*
   --------------------------------
   RESPONSE
   --------------------------------
   */

   return {

      message:
         "DBF uploaded successfully",

      batchId:
         batch.id,

      totalClients,

      totalContracts,

      completedRecords,

      errorRecords,

      previewClients,

      previewContracts
   };

};