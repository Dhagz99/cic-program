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

   for (const client of batch.stagingClients) {

      if (
         client.validationStatus !==
         "COMPLETE"
      ) {

         throw new Error(
            "Batch contains invalid clients"
         );

      }

      if (!client.isConfirmed) {

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

         if (
            !contract.isConfirmed
         ) {

            throw new Error(
               "Batch contains unconfirmed contracts"
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