import { ContractStatus } from "../../../../../generated/prisma";
import prisma from "../../../../lib/prisma";

type FinalizeBatchParams = {
   batchId: string;
};

export const finalizeBatchService =
async ({
   batchId
}: FinalizeBatchParams) => {

   const batch =
      await prisma.importBatch.findUnique({

         where: {
            id: batchId
         },

         include: {

            stagingClients: {

               include: {

                  stagingContracts: true,
                  batch: true

               }

            }

         }

      });

   if (!batch) {

      throw new Error(
         "Batch not found"
      );

   }

   /*
   |--------------------------------------------------------------------------
   | PROCESS CLIENTS
   |--------------------------------------------------------------------------
   */

   for (
      const stagingClient of
      batch.stagingClients
   ) {

      if (
         !stagingClient.providerSubjectNo
      ) {
         continue;
      }

      /*
      |--------------------------------------------------------------------------
      | UPSERT CLIENT
      |--------------------------------------------------------------------------
      */

      const client =
         await prisma.client.upsert({


               where: {

                    branchId_providerSubjectNo: {
               
                     branchId:
                        batch.branchId,
               
                     providerSubjectNo:
                        stagingClient.providerSubjectNo || ""
               
                  }
               
            },

            update: {
               
               providerCode:
                  stagingClient.providerCode,

               branchCode:
                  stagingClient.branchCode,

               title:
                  stagingClient.title,

               firstName:
                  stagingClient.firstName || "",

               middleName:
                  stagingClient.middleName,

               lastName:
                  stagingClient.lastName || "",

               suffix:
                  stagingClient.suffix,

               nickname:
                  stagingClient.nickname,

               prevLastName:
                  stagingClient.prevLastName,

               genderCode:
                  stagingClient.genderCode,

               birthDate:
                  stagingClient.birthDate,

               placeOfBirth:
                  stagingClient.placeOfBirth,

               countryOfBirthCode:
                  stagingClient.countryOfBirthCode,

               nationality:
                  stagingClient.nationality,

               resident:
                  stagingClient.resident,

               civilStatusCode:
                  stagingClient.civilStatusCode,

               numberOfDependents:
                  stagingClient.numberOfDependents,

               addressType:
                  stagingClient.addressType,

               address:
                  stagingClient.address,

               addressType2:
                  stagingClient.addressType2,

               address2:
                  stagingClient.address2,

               identificationTypeCode:
                  stagingClient.identificationTypeCode,

               identificationNumber:
                  stagingClient.identificationNumber,

               contactType:
                  stagingClient.contactType,

               contactValue:
                  stagingClient.contactValue,



            },

            create: {

               batchId: batchId,

               branchId:
               batch.branchId,

               providerCode:
                  stagingClient.providerCode,

               branchCode:
                  stagingClient.branchCode,

               providerSubjectNo:
                  stagingClient.providerSubjectNo,

               title:
                  stagingClient.title,

               firstName:
                  stagingClient.firstName || "",

               middleName:
                  stagingClient.middleName,

               lastName:
                  stagingClient.lastName || "",

               suffix:
                  stagingClient.suffix,

               nickname:
                  stagingClient.nickname,

               prevLastName:
                  stagingClient.prevLastName,

               genderCode:
                  stagingClient.genderCode,

               birthDate:
                  stagingClient.birthDate,

               placeOfBirth:
                  stagingClient.placeOfBirth,

               countryOfBirthCode:
                  stagingClient.countryOfBirthCode,

               nationality:
                  stagingClient.nationality,

               resident:
                  stagingClient.resident,

               civilStatusCode:
                  stagingClient.civilStatusCode,

               numberOfDependents:
                  stagingClient.numberOfDependents,

               addressType:
                  stagingClient.addressType,

               address:
                  stagingClient.address,

               addressType2:
                  stagingClient.addressType2,

               address2:
                  stagingClient.address2,

               identificationTypeCode:
                  stagingClient.identificationTypeCode,

               identificationNumber:
                  stagingClient.identificationNumber,

               contactType:
                  stagingClient.contactType,

               contactValue:
                  stagingClient.contactValue,


            }

         });

      /*
      |--------------------------------------------------------------------------
      | PROCESS CONTRACTS
      |--------------------------------------------------------------------------
      */

      for (
         const stagingContract of
         stagingClient.stagingContracts
      ) {

         if (
            !stagingContract.contractNo
         ) {
            continue;
         }

         /*
         |--------------------------------------------------------------------------
         | UPSERT CONTRACT
         |--------------------------------------------------------------------------
         */

         const contract =
         await prisma.contract.upsert({
      
            where: {
      
               branchId_contractNo: {
      
                  branchId:
                     batch.branchId,
      
                  contractNo:
                     stagingContract.contractNo
      
               }
      
            },
      
            update: {
      
               clientId:
                  client.id,
      
               providerCode:
                  stagingContract.providerCode,
      
               branchCode:
                  stagingContract.branchCode,
      
               providerSubjectNo:
                  stagingContract.providerSubjectNo,
      
               role:
                  stagingContract.role,
      
               contractType:
                  stagingContract.contractType,
      
               contractPhase:
                  stagingContract.contractPhase,
      
               contractStatus:
                  stagingContract.contractStatus,
      
               currency:
                  stagingContract.currency,
      
               originalCurrency:
                  stagingContract.originalCurrency,
      
               contractStartDate:
                  stagingContract.contractStartDate,
      
               contractRequestDate:
                  stagingContract.contractRequestDate,
      
               contractEndPlannedDate:
                  stagingContract.contractEndPlannedDate,
      
               contractEndActualDate:
                  stagingContract.contractEndActualDate,
      
               lastPaymentDate:
                  stagingContract.lastPaymentDate,
      
               financedAmount:
                  stagingContract.financedAmount,
      
               installmentsNumber:
                  stagingContract.installmentsNumber,
      
               transactionType:
                  stagingContract.transactionType,
      
               paymentPeriodicity:
                  stagingContract.paymentPeriodicity,
      
               paymentMethod:
                  stagingContract.paymentMethod,
      
               monthlyPaymentAmount:
                  stagingContract.monthlyPaymentAmount,
      
               firstPaymentDate:
                  stagingContract.firstPaymentDate,
      
               lastPaymentAmount:
                  stagingContract.lastPaymentAmount,
      
               nextPaymentDate:
                  stagingContract.nextPaymentDate,
      
               nextPaymentAmount:
                  stagingContract.nextPaymentAmount,
      
               outstandingPaymentNumber:
                  stagingContract.outstandingPaymentNumber,
      
               outstandingBalance:
                  stagingContract.outstandingBalance,
      
               overduePaymentNumber:
                  stagingContract.overduePaymentNumber,
      
               overduePaymentAmount:
                  stagingContract.overduePaymentAmount
      
            },
      
            create: {
      
               branchId:
                  batch.branchId,
      
               batchId:
                  batch.id,
      
               clientId:
                  client.id,
      
               providerCode:
                  stagingContract.providerCode,
      
               branchCode:
                  stagingContract.branchCode,
      
               providerSubjectNo:
                  stagingContract.providerSubjectNo,
      
               role:
                  stagingContract.role,
      
               contractNo:
                  stagingContract.contractNo,
      
               contractType:
                  stagingContract.contractType,
      
               contractPhase:
                  stagingContract.contractPhase,
      
               contractStatus:
                  stagingContract.contractStatus,
      
               currency:
                  stagingContract.currency,
      
               originalCurrency:
                  stagingContract.originalCurrency,
      
               contractStartDate:
                  stagingContract.contractStartDate,
      
               contractRequestDate:
                  stagingContract.contractRequestDate,
      
               contractEndPlannedDate:
                  stagingContract.contractEndPlannedDate,
      
               contractEndActualDate:
                  stagingContract.contractEndActualDate,
      
               lastPaymentDate:
                  stagingContract.lastPaymentDate,
      
               financedAmount:
                  stagingContract.financedAmount,
      
               installmentsNumber:
                  stagingContract.installmentsNumber,
      
               transactionType:
                  stagingContract.transactionType,
      
               paymentPeriodicity:
                  stagingContract.paymentPeriodicity,
      
               paymentMethod:
                  stagingContract.paymentMethod,
      
               monthlyPaymentAmount:
                  stagingContract.monthlyPaymentAmount,
      
               firstPaymentDate:
                  stagingContract.firstPaymentDate,
      
               lastPaymentAmount:
                  stagingContract.lastPaymentAmount,
      
               nextPaymentDate:
                  stagingContract.nextPaymentDate,
      
               nextPaymentAmount:
                  stagingContract.nextPaymentAmount,
      
               outstandingPaymentNumber:
                  stagingContract.outstandingPaymentNumber,
      
               outstandingBalance:
                  stagingContract.outstandingBalance,
      
               overduePaymentNumber:
                  stagingContract.overduePaymentNumber,
      
               overduePaymentAmount:
                  stagingContract.overduePaymentAmount
      
            }
      
         });

         /*
         |--------------------------------------------------------------------------
         | SNAPSHOT
         |--------------------------------------------------------------------------
         */

         await prisma.contractMonthlySnapshot.create({

            data: {

               contractId:
                  contract.id,

               reportingPeriodId:
                  batch.reportingPeriodId,

                  contractStatus: "CURRENT",

               financedAmount:
                  stagingContract.financedAmount,

               balanceAmount:
                  stagingContract.outstandingBalance,

               lastPaymentDate:
                  stagingContract.lastPaymentDate

            }

         });

      }

   }

   /*
   |--------------------------------------------------------------------------
   | FINALIZE BATCH
   |--------------------------------------------------------------------------
   */

   return prisma.importBatch.update({

      where: {
         id: batchId
      },

      data: {

         status:
            "FINALIZED"

      }

   });

};