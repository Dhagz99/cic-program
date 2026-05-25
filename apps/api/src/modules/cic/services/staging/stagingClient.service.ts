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
         batch: {
            connect: {
               id: batchId
            }
         },

         providerSubjectNo:
            client.providerSubjectNo,

         firstName:
            client.firstName,

         middleName:
            client.middleName,

         lastName:
            client.lastName,
         
         suffix:
            client.suffix,

         birthDate:
            client.birthDate
               ? client.birthDate
               : null,

         address:
            client.address,
         addressCity:
             client.addressCity,
         addressBarangay:
            client.addressBarangay,
         addressProvince:
            client.addressProvince,
         addressPostalCode:
            client.addressPostalCode,   

         address2: 
            client.address,

       ...(client.grouping && {

               identificationType: {
                  connect: {
                     code: client.grouping
                  }
               }
            }),

         identificationNumber:
            client.sssNo,   

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