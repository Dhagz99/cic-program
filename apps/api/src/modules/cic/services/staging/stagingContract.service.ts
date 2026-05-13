import prisma from "../../../../lib/prisma";

export const saveStagingContract = async ({
   batchId,
   stagingClientId,
   contract,
   validationErrors
}: any) => {

   const validationStatus =
      validationErrors.length > 0
      ? "WITH_ERRORS"
      : "COMPLETE";

   /*
   --------------------------------
   SAVE STAGING CONTRACT
   --------------------------------
   */

   const stagingContract =
      await prisma.stagingContract.create({
         data: {

            batchId,

            stagingClientId,

            contractNo:
               contract.contractNo,

            financedAmount:
               contract.financedAmount,

            contractStatus:
               contract.contractStatus,

            validationStatus
         }
      });

   /*
   --------------------------------
   SAVE VALIDATION ERRORS
   --------------------------------
   */

   if (validationErrors.length > 0) {

      await prisma.validationError.createMany({
         data:
            validationErrors.map(
               (err: any) => ({
                  stagingContractId:
                     stagingContract.id,

                  fieldName:
                     err.fieldName,

                  errorMessage:
                     err.errorMessage
               })
            )
      });

   }

   return stagingContract;
};