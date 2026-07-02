import prisma from "../../../../lib/prisma";

export const submitBatchService =
async ({
   batchId,
   userId
}: any) => {

   const batch =
      await prisma.importBatch.findUnique({

         where: {
            id: batchId
         },

         include: {

            stagingClients: {

               include: {
                  stagingContracts: true
               }

            }

         }

      });

   if (!batch) {

      throw new Error(
         "Batch not found"
      );

   }

/*
--------------------------------
CHECK CLIENTS
--------------------------------
*/

const providerSubjectNos =
   batch.stagingClients
      .map((client) => client.providerSubjectNo)
      .filter((value): value is string =>
         typeof value === "string" &&
         value.trim() !== ""
      );

const existingClients =
   await prisma.client.findMany({
      where: {
         branchId:
            batch.branchId,

         providerSubjectNo: {
            in:
               providerSubjectNos
         }
      }
   });

const existingClientMap =
   new Map(
      existingClients.map((client) => [
         client.providerSubjectNo,
         client
      ])
   );

for (const client of batch.stagingClients) {

   const existingClient =
      existingClientMap.get(
         client.providerSubjectNo
      );

   const hasExistingCleanClient =
      Boolean(existingClient);

   if (
      client.validationStatus !== "COMPLETE" &&
      !hasExistingCleanClient
   ) {

      throw new Error(
         "Batch contains invalid clients"
      );

   }

   if (
      !client.isConfirmed &&
      !hasExistingCleanClient
   ) {

      throw new Error(
         "Batch contains unconfirmed clients"
      );

   }

   /*
   -----------------------------
   CONTRACTS
   -----------------------------
   */

   for (
      const contract of
      client.stagingContracts
   ) {

      if (
         contract.validationStatus !==
         "COMPLETE"
      ) {

         throw new Error(
            "Batch contains invalid contracts"
         );

      }

   }

}

   /*
   --------------------------------
   UPDATE STATUS
   --------------------------------
   */

   return prisma.importBatch.update({

      where: {
         id: batchId
      },

      data: {

         status:
            "FOR_REVIEW",

         submittedAt:
            new Date(),

         submittedById:
            userId
      }

   });

};