import prisma from "../../../../lib/prisma";

export const finalizeBatchService =
async ({
   batchId
}: any) => {

   const batch =
      await prisma.importBatch.findUnique({

         where: {
            id: batchId
         },

         include: {

            stagingClients: {

               include: {
                  stagingContracts: true
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
   --------------------------------
   CREATE FINAL RECORDS
   --------------------------------
   */

   for (const stagingClient of batch.stagingClients) {

      /*
      -----------------------------
      UPSERT CLIENT
      -----------------------------
      */

      const client =
         await prisma.client.upsert({

            where: {
               providerSubjectNo:
                  stagingClient.providerSubjectNo || ""
            },

            update: {

               firstName:
                  stagingClient.firstName || "",

               middleName:
                  stagingClient.middleName,

               lastName:
                  stagingClient.lastName || "",

               birthDate:
                  stagingClient.birthDate,

               gender:
                  stagingClient.gender,

               civilStatus:
                  stagingClient.civilStatus,

               address:
                  stagingClient.address,

               tinNumber:
                  stagingClient.tinNumber
            },

            create: {

               branchId:
                  batch.branchId,

               providerSubjectNo:
                  stagingClient.providerSubjectNo,

               firstName:
                  stagingClient.firstName || "",

               middleName:
                  stagingClient.middleName,

               lastName:
                  stagingClient.lastName || "",

               birthDate:
                  stagingClient.birthDate,

               gender:
                  stagingClient.gender,

               civilStatus:
                  stagingClient.civilStatus,

               address:
                  stagingClient.address,

               tinNumber:
                  stagingClient.tinNumber
            }

         });

      /*
      -----------------------------
      CONTRACTS
      -----------------------------
      */

      for (
         const stagingContract of
         stagingClient.stagingContracts
      ) {

         /*
         --------------------------
         UPSERT CONTRACT
         --------------------------
         */

         const contract =
            await prisma.contract.upsert({

               where: {
                  contractNo:
                     stagingContract.contractNo || ""
               },

               update: {
                  clientId:
                     client.id
               },

               create: {

                  clientId:
                     client.id,

                  contractNo:
                     stagingContract.contractNo || ""
               }

            });

         /*
         --------------------------
         SNAPSHOT
         --------------------------
         */

         await prisma.contractMonthlySnapshot.create({

            data: {

               contractId:
                  contract.id,

               reportingPeriodId:
                  batch.reportingPeriodId,

               contractStatus:
                  "CURRENT",

               financedAmount:
                  stagingContract.financedAmount,

               lastPaymentDate:
                  stagingContract.lastPaymentDate
            }

         });

      }

   }

   /*
   --------------------------------
   FINALIZE BATCH
   --------------------------------
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