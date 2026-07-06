
import prisma from "../../../../lib/prisma";
import {
   validateClient
} from "../validation/clientValidation.service";
import { confirmStagingRecordService } from "./confirmStagingRecord.service";

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

         firstName:
            data.firstName,

         middleName:
            data.middleName,

         lastName:
            data.lastName,

         suffix:
            data.suffix,

         gender: {

            connect: {
               code: data.gender
            }

         },

         birthDate:
         data.birthDate
            ? new Date(data.birthDate)
            : undefined,

         placeOfBirth:
            data.placeOfBirth,

         civilStatus: {

            connect: {
               code: Number(data.civilStatus)
            }

         },

         numberOfDependents:
            data.numberOfDependents,

         addressType:
            data.addressType,

         address:
            data.address,

         addressType2:
            data.addressType2,

         address2:
            data.address2,

         identificationType: {

            connect: {
               code: Number(data.identificationType)
            }

         },

         identificationNumber:
            data.identificationNumber,

         secondaryIdentificationType:
            data.secondaryIdentificationTypeCode
               ? {
                    connect: {
                       code: Number(data.secondaryIdentificationTypeCode)
                    }
                 }
               : {
                    disconnect: true
                 },

      secondaryIdentificationNumber:
         data.secondaryIdentificationNumber,

         contactType:
            data.contactType,

         contactValue:
            data.contactValue

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