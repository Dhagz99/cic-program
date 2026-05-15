
import prisma from "../../../../lib/prisma";
import {
   validateClient
} from "../validation/clientValidation.service";

export const updateStagingClientService =
async ({
   id,
   data
}: any) => {

   /*
   -----------------------------------
   UPDATE CLIENT
   -----------------------------------
   */

   const updatedClient =
      await prisma.stagingClient.update({
         where: {
            id
         },
         
         data: {
            ...data,
            birthDate:
               data.birthDate 
                ? new Date(data.birthDate)
               : null
         }
      });

   /*
   -----------------------------------
   DELETE OLD ERRORS
   -----------------------------------
   */

   await prisma.validationError.deleteMany({
      where: {
         stagingClientId: id
      }
   });

   /*
   -----------------------------------
   REVALIDATE
   -----------------------------------
   */

   const validationErrors =
      validateClient(updatedClient);

   /*
   -----------------------------------
   SAVE NEW ERRORS
   -----------------------------------
   */

   if (validationErrors.length > 0) {

      await prisma.validationError.createMany({

         data:
            validationErrors.map(
               (err: any) => ({

                  stagingClientId: id,

                  fieldName:
                     err.fieldName,

                  errorMessage:
                     err.errorMessage
               })
            )

      });

   }

   /*
   -----------------------------------
   UPDATE STATUS
   -----------------------------------
   */

   const validationStatus =
      validationErrors.length > 0
      ? "WITH_ERRORS"
      : "COMPLETE";

   return prisma.stagingClient.update({

      where: {
         id
      },

      data: {
         validationStatus
      }

   });

};