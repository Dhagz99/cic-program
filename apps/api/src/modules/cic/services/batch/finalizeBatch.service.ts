import { ContractStatus } from "../../../../../generated/prisma";
import prisma from "../../../../lib/prisma";
import { getMergedValue } from "../../utils/value/getMergedValue";

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

   //FIND EXISTING CLIENT
   const existingClient =
      await prisma.client.findUnique({

         where: {

            branchId_providerSubjectNo: {

               branchId:
                  batch.branchId,

               providerSubjectNo:
                  stagingClient.providerSubjectNo || ""

            }

         }

      });

   const mergedClient = {

      providerCode:
         stagingClient.providerCode
         || existingClient?.providerCode,
   
      branchCode:
         stagingClient.branchCode
         || existingClient?.branchCode,
   
      title:
         stagingClient.title
         || existingClient?.title,
   
      firstName:
         stagingClient.firstName
         || existingClient?.firstName
         || "",
   
      middleName:
         stagingClient.middleName
         || existingClient?.middleName,
   
      lastName:
         stagingClient.lastName
         || existingClient?.lastName
         || "",
   
      suffix:
         stagingClient.suffix
         || existingClient?.suffix,
   
      nickname:
         stagingClient.nickname
         || existingClient?.nickname,
   
      prevLastName:
         stagingClient.prevLastName
         || existingClient?.prevLastName,
   
      genderCode:
         stagingClient.genderCode
         || existingClient?.genderCode,
   
      birthDate:
         stagingClient.birthDate
         || existingClient?.birthDate,
   
      placeOfBirth:
         stagingClient.placeOfBirth
         || existingClient?.placeOfBirth,
   
      countryOfBirthCode:
         stagingClient.countryOfBirthCode
         || existingClient?.countryOfBirthCode,
   
      nationality:
         stagingClient.nationality
         || existingClient?.nationality,
   
      resident:
         stagingClient.resident
         ?? existingClient?.resident,
   
      civilStatusCode:
         stagingClient.civilStatusCode
         || existingClient?.civilStatusCode,
   
      numberOfDependents:
         stagingClient.numberOfDependents
         || existingClient?.numberOfDependents,
   
      addressType:
         stagingClient.addressType
         || existingClient?.addressType,
   
      address:
         stagingClient.address
         || existingClient?.address,
   
      addressType2:
         stagingClient.addressType2
         || existingClient?.addressType2,
   
      address2:
         stagingClient.address2
         || existingClient?.address2,
   
      identificationTypeCode:
         (
            stagingClient.identificationTypeCode === 10 ||
            !stagingClient.identificationTypeCode
         )
         ? existingClient?.identificationTypeCode
         : stagingClient.identificationTypeCode,
   
      identificationNumber:
         stagingClient.identificationNumber
         || existingClient?.identificationNumber,
   
      contactType:
         stagingClient.contactType
         || existingClient?.contactType,
   
      contactValue:
         stagingClient.contactValue
         || existingClient?.contactValue
   
   };

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
                  mergedClient.providerCode,

               branchCode:
                  stagingClient.branchCode,

               title:
                  stagingClient.title,

               firstName:
                  stagingClient.firstName || "",

               middleName:
                   mergedClient.middleName,

               lastName:
                  stagingClient.lastName || "",

               suffix:
                     mergedClient.suffix,

               nickname:
                  stagingClient.nickname,

               prevLastName:
                  stagingClient.prevLastName,

               genderCode:
                  mergedClient.genderCode,

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
                  mergedClient.civilStatusCode,

               numberOfDependents:
                  stagingClient.numberOfDependents,

               addressType:
                  stagingClient.addressType,

               address:
                  mergedClient.address,

               addressType2:
                  stagingClient.addressType2,

               address2:
                  mergedClient.address2,

               identificationTypeCode:
                   mergedClient.identificationTypeCode,

               identificationNumber:
                  stagingClient.identificationNumber,

               contactType:
                   mergedClient.contactType,

               contactValue:
                   mergedClient.contactValue,
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

         const existingContract =
         await prisma.contract.findUnique({
            where: {
               branchId_contractNo: {
                  branchId:
                     batch.branchId,
      
                  contractNo:
                     stagingContract.contractNo
               }
            },
            select: {
               id: true,
               contractNo: true,
               outstandingBalance: true
            }
         });
   
      const existingBalance =
         Number(existingContract?.outstandingBalance ?? 0);
   
      const stagingBalance =
         Number(stagingContract.outstandingBalance ?? 0);
   
      if (
         existingContract &&
         existingBalance === 0 &&
         stagingBalance === 0
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
         const snapshotStatus =
         Object.values(
            ContractStatus
         ).includes(
      
            stagingContract.contractStatus as ContractStatus
      
         )
      
            ? stagingContract.contractStatus as ContractStatus
      
            : ContractStatus.CURRENT;
      
      /*
      |--------------------------------------------------------------------------
      | CREATE SNAPSHOT
      |--------------------------------------------------------------------------
      */
      
      await prisma.contractMonthlySnapshot.upsert({
      
         where: {
      
            contractId_reportingPeriodId: {
      
               contractId:
                  contract.id,
      
               reportingPeriodId:
                  batch.reportingPeriodId
      
            }
      
         },
      
         update: {
      
            contractStatus:
               snapshotStatus,
      
            financedAmount:
               stagingContract.financedAmount,
      
            balanceAmount:
               stagingContract.outstandingBalance,
      
            monthlyPaymentAmount:
               stagingContract.monthlyPaymentAmount,
      
            overduePaymentAmount:
               stagingContract.overduePaymentAmount,
      
            overduePaymentNumber:
               stagingContract.overduePaymentNumber,
      
            outstandingPaymentNumber:
               stagingContract.outstandingPaymentNumber,
      
            lastPaymentAmount:
               stagingContract.lastPaymentAmount,
      
            lastPaymentDate:
               stagingContract.lastPaymentDate,
      
            nextPaymentAmount:
               stagingContract.nextPaymentAmount,
      
            nextPaymentDate:
               stagingContract.nextPaymentDate
      
         },
      
         create: {
      
            branchId:
               batch.branchId,
      
            contractId:
               contract.id,
      
            reportingPeriodId:
               batch.reportingPeriodId,
      
            contractStatus:
               snapshotStatus,
      
            financedAmount:
               stagingContract.financedAmount,
      
            balanceAmount:
               stagingContract.outstandingBalance,
      
            monthlyPaymentAmount:
               stagingContract.monthlyPaymentAmount,
      
            overduePaymentAmount:
               stagingContract.overduePaymentAmount,
      
            overduePaymentNumber:
               stagingContract.overduePaymentNumber,
      
            outstandingPaymentNumber:
               stagingContract.outstandingPaymentNumber,
      
            lastPaymentAmount:
               stagingContract.lastPaymentAmount,
      
            lastPaymentDate:
               stagingContract.lastPaymentDate,
      
            nextPaymentAmount:
               stagingContract.nextPaymentAmount,
      
            nextPaymentDate:
               stagingContract.nextPaymentDate
      
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