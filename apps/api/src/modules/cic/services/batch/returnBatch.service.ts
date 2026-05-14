import prisma from "../../../../lib/prisma";

export const returnBatchService =
async ({
   batchId,
   userId,
   reason
}: any) => {

   return prisma.importBatch.update({

      where: {
         id: batchId
      },

      data: {

         status:
            "RETURNED",

         returnedAt:
            new Date(),

         returnedById:
            userId,

         returnReason:
            reason
      }

   });

};