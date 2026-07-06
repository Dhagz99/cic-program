import prisma from "../../../../lib/prisma";
import { validateClient } from "../validation/clientValidation.service";

export const getBatchStagingRecordsService =
async (
   batchId: string
) => {

   /*
   |--------------------------------------------------------------------------
   | FIND STAGING CLIENTS
   |--------------------------------------------------------------------------
   */

   const stagingClients =
      await prisma.stagingClient.findMany({

         where: {
            batchId
         },

         include: {

            validationErrors: true,

            identificationType: true,

            gender: true,

            civilStatus: true,

            stagingContracts: {

               include: {

                  validationErrors: true

               }

            },

            batch: true

         },

         orderBy: {

            createdAt: "desc"

         }

      });


      


   /*
   |--------------------------------------------------------------------------
   | BUILD RECONCILIATION DATA
   |--------------------------------------------------------------------------
   */

   const results =
      await Promise.all(

         stagingClients.map(
         async (
            stagingClient
         ) => {

            /*
            |--------------------------------------------------------------------------
            | FIND EXISTING CLIENT
            |--------------------------------------------------------------------------
            */

            const existingClient =
               await prisma.client.findFirst({

                  where: {

                     branchId:
                        stagingClient.batch.branchId,

                     providerSubjectNo:
                        stagingClient.providerSubjectNo || ""

                  },

                  include: {

                     Contracts: true

                  }

               });

            /*
            |--------------------------------------------------------------------------
            | MERGED PREVIEW
            |--------------------------------------------------------------------------
            |
            | ENTERPRISE RULE:
            |
            | Keep existing trusted data
            | if staging upload is empty.
            |--------------------------------------------------------------------------
            */

            const mergedPreview = {

               /*
               |--------------------------------------------------------------------------
               | BASIC INFO
               |--------------------------------------------------------------------------
               */

               firstName:

                  stagingClient.firstName ||
                  existingClient?.firstName ||
                  "",

               middleName:

                  stagingClient.middleName ||
                  existingClient?.middleName ||
                  "",

               lastName:

                  stagingClient.lastName ||
                  existingClient?.lastName ||
                  "",

               suffix:

                  stagingClient.suffix ||
                  existingClient?.suffix ||
                  "",

               /*
               |--------------------------------------------------------------------------
               | GENDER
               |--------------------------------------------------------------------------
               */

               genderCode:

                  existingClient?.genderCode ||
                  stagingClient.genderCode ||
                  "",

               /*
               |--------------------------------------------------------------------------
               | BIRTH DATE
               |--------------------------------------------------------------------------
               */

               birthDate:

                  stagingClient.birthDate ||
                  existingClient?.birthDate ||
                  null,

               /*
               |--------------------------------------------------------------------------
               | CIVIL STATUS
               |--------------------------------------------------------------------------
               */

               civilStatusCode:

                  existingClient?.civilStatusCode ||
                  stagingClient.civilStatusCode ||
                  null,

               /*
               |--------------------------------------------------------------------------
               | ADDRESS
               |--------------------------------------------------------------------------
               */

               address:

                  existingClient?.address ||
                  stagingClient.address ||
                  "",

               address2:

                  existingClient?.address2 ||
                  stagingClient.address2 ||
                  "",

               /*
               |--------------------------------------------------------------------------
               | IDENTIFICATION
               |--------------------------------------------------------------------------
               */

               identificationTypeCode:

                  existingClient?.identificationTypeCode ||
                  stagingClient.identificationTypeCode ||
                  null,

               identificationNumber:

                  existingClient?.identificationNumber ||
                  stagingClient.identificationNumber ||
                  "",


            secondaryIdentificationTypeCode:

                  existingClient?.secondaryIdentificationTypeCode ||
                  stagingClient.secondaryIdentificationTypeCode ||
                  null,

            secondaryIdentificationNumber:

                  existingClient?.secondaryIdentificationNumber ||
                  stagingClient.secondaryIdentificationNumber ||
                  "",

               /*
               |--------------------------------------------------------------------------
               | CONTACT
               |--------------------------------------------------------------------------
               */

               contactType:

                  existingClient?.contactType ||
                  stagingClient.contactType ||
                  "",

               contactValue:

                  existingClient?.contactValue ||
                  stagingClient.contactValue ||
                  ""

            };

            //Validate merge data

            const effectiveValidationErrors =
               validateClient(
                  mergedPreview
               );

               const effectiveValidationStatus =

                  effectiveValidationErrors.length > 0

                     ? "WITH_ERRORS"

                     : "COMPLETE";

            /*
            |--------------------------------------------------------------------------
            | COMPARISON FLAGS
            |--------------------------------------------------------------------------
            */

            const comparison = {

               firstNameConflict:

                  existingClient?.firstName &&
                  stagingClient.firstName &&
                  existingClient.firstName !==
                  stagingClient.firstName,

               genderMissing:

                  !stagingClient.genderCode &&
                  !!existingClient?.genderCode,

               addressMissing:

                  !stagingClient.address &&
                  !!existingClient?.address

            };

            /*
            |--------------------------------------------------------------------------
            | RETURN REVIEW OBJECT
            |--------------------------------------------------------------------------
            */



            return {

               /*
               |--------------------------------------------------------------------------
               | RAW STAGING
               |--------------------------------------------------------------------------
               */

               stagingClient,

               /*
               |--------------------------------------------------------------------------
               | EXISTING MASTER
               |--------------------------------------------------------------------------
               */

               existingClient,

               /*
               |--------------------------------------------------------------------------
               | FINAL PREVIEW
               |--------------------------------------------------------------------------
               */

               mergedPreview,

               /*
               |--------------------------------------------------------------------------
               | FLAGS
               |--------------------------------------------------------------------------
               */

               comparison,

               effectiveValidationErrors,

               effectiveValidationStatus,

            };

         })

      );

   return results;

};