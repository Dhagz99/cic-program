import prisma from "../../../../lib/prisma";

export const confirmStagingRecordService =
async ({
   type,
   id
}: any) => {

   /*
   -----------------------------------
   CLIENT
   -----------------------------------
   */

   if (type === "CLIENT") {

      const client =
         await prisma.stagingClient.findUnique({

            where: {
               id
            }

         });

      if (
         client?.validationStatus !==
         "COMPLETE"
      ) {

         throw new Error(
            "Client has validation errors"
         );

      }

      return prisma.stagingClient.update({

         where: {
            id
         },

         data: {
            isConfirmed: true
         }

      });

   }

   /*
   -----------------------------------
   CONTRACT
   -----------------------------------
   */

   const contract =
      await prisma.stagingContract.findUnique({

         where: {
            id
         }

      });

   if (
      contract?.validationStatus !==
      "COMPLETE"
   ) {

      throw new Error(
         "Contract has validation errors"
      );

   }

   return prisma.stagingContract.update({

      where: {
         id
      },

      data: {
         isConfirmed: true
      }

   });

};