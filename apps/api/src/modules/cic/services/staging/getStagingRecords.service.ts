import prisma from "../../../../lib/prisma";

export const getBatchStagingRecordsService =
async (
   batchId: string
) => {

   const clients =
      await prisma.stagingClient.findMany({

         where: {
            batchId
         },

         include: {

            validationErrors: true,

            stagingContracts: {
               include: {
                  validationErrors: true
               }
            }

         },

         orderBy: {
            createdAt: "desc"
         }

      });

   return clients;
};