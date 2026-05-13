
import prisma from "../../../../lib/prisma";
import {
   validateContract
} from "../validation/contractValidation.service";

export const updateStagingContractService =
async ({
   id,
   data
}: any) => {

   const updatedContract =
      await prisma.stagingContract.update({

         where: {
            id
         },

         data
      });

   /*
   -----------------------------------
   DELETE OLD ERRORS
   -----------------------------------
   */

   await prisma.validationError.deleteMany({
      where: {
         stagingContractId: id
      }
   });

   /*
   -----------------------------------
   REVALIDATE
   -----------------------------------
   */

   const validationErrors =
      validateContract(
         updatedContract
      );

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

                  stagingContractId:
                     id,

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

   return prisma.stagingContract.update({

      where: {
         id
      },

      data: {
         validationStatus
      }

   });

};