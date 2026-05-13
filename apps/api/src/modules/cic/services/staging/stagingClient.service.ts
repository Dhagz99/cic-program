import prisma from "../../../../lib/prisma";

export const saveStagingClient = async ({
   batchId,
   client,
   validationErrors
}: any) => {

   const validationStatus =
      validationErrors.length > 0
      ? "WITH_ERRORS"
      : "COMPLETE";

   /*
   --------------------------------
   SAVE STAGING CLIENT
   --------------------------------
   */

   const stagingClient =
      await prisma.stagingClient.create({
         data: {

            batchId,

            providerSubjectNo:
               client.providerSubjectNo,

            firstName:
               client.fullName,

            birthDate:
               client.birthDate,

            address:
               client.address,

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
                  stagingClientId:
                     stagingClient.id,

                  fieldName:
                     err.fieldName,

                  errorMessage:
                     err.errorMessage
               })
            )
      });

   }

   return stagingClient;
};