import prisma from "../../../../lib/prisma";

export const approveBatchService =
async ({
   batchId,
   userId
}: any) => {

   return prisma.importBatch.update({

      where: {
         id: batchId
      },

      data: {

         status:
            "APPROVED",

         approvedAt:
            new Date(),

         approvedById:
            userId
      }

   });

};