import { GetClientLoansParams, UpdateLoanFormValues } from "@repo/shared";
import prisma from "../../lib/prisma";
import { notEqual } from "assert";

export async function getClientLoansServices({
   branchId,
   page = 1,
   limit = 10,
   search = "",
   contractPhase,
   isAdmin
}: GetClientLoansParams) {

   /*
   -----------------------------------
   BASE FILTER
   -----------------------------------
   */

   const branchFilter =
   isAdmin
      ? {}
      : {
           branchId
        };


 
   const whereCondition = {

      ...branchFilter,

      ...(contractPhase && {
         contractPhase
      }),

      ...(search && {

         OR: [

            {
               contractNo: {
                  contains: search,
                  mode: "insensitive" as const
               }
            },

            {
               providerSubjectNo: {
                  contains: search,
                  mode: "insensitive" as const
               }
            },

            {
               client: {
                  firstName:{
                     contains: search,
                     mode: "insensitive" as const
                  }
               }
            },

            {
               client: {
                  lastName:{
                     contains: search,
                     mode: "insensitive" as const
                  }
               }
            }

         ]

      })

   };

   /*
   -----------------------------------
   GET LATEST CONTRACT PER CLIENT
   -----------------------------------
   */

   

   /*
   -----------------------------------
   BUILD WHERE FOR LATEST RECORDS
   -----------------------------------
   */

   // const latestWhere = {

   //    OR:

   //       latestContracts.map(
   //          (item) => ({

   //             providerSubjectNo:
   //                item.providerSubjectNo,

   //             createdAt:
   //                item._max.createdAt!

   //          })
   //       )

   // };

   /*
   -----------------------------------
   TOTAL LATEST RECORDS
   -----------------------------------
   */

const totalLoan =
  await prisma.contract.count({
    where: whereCondition
  });

   /*
   -----------------------------------
   PAGINATED LATEST CONTRACTS
   -----------------------------------
   */

   const [
      contracts,
      totalLoanAmount,
      activeLoans,
      pastDueLoans,
      totalLoans
   ] = await Promise.all([

      prisma.contract.findMany({

         where:
            whereCondition,

         skip:
            (page - 1) * limit,

         take:
            limit,

         orderBy: {

            createdAt:
               "desc"

         },

         include: {

            client:
               true

         }

      }),

      /*
      -----------------------------------
      TOTAL LOAN AMOUNT
      -----------------------------------
      */

      prisma.contract.aggregate({

        where: branchFilter,

         _sum: {

            financedAmount:
               true

         }

      }),

      /*
      -----------------------------------
      ACTIVE LOANS
      -----------------------------------
      */
      prisma.contract.count({
        where: {
            AND: [
               branchFilter,
               {
                  contractPhase:
                     "AC"
               }
   
            ]
   
         }
      }),

      /*
      -----------------------------------
      PAST DUE LOANS
      -----------------------------------
      */

      prisma.contract.count({

         where: {
            ...branchFilter,
            contractStatus:
               "PAST_DUE"

         }

      }),

      prisma.contract.count({

         where: {
            ...branchFilter,

         }

      })

   ]);

   return {

      data:
         contracts,

      pagination: {
         total: totalLoan,
         page,
         limit,
         totalPages: Math.ceil(totalLoan / limit)
      },

      summary: {

         totalLoanAmount:

            Number(

               totalLoanAmount
                  ._sum
                  .financedAmount || 0

            ),

         activeLoans,

         pastDueLoans,

         totalLoans

      }

   };

}

export async function getLoanByIdService(id: string) {
      const loan = await prisma.contract.findUnique({
         where: {
            id
         },
         include:{
            client: true
         }
      });

      if(!loan){
         throw new Error("Loan not found.");
      }
      return loan
   
}



export async function updateLoanService(id: string, data: UpdateLoanFormValues ) {

   return prisma.$transaction(async (tx) => {
      const loan = await prisma.contract.findUnique({
      where:{
         id
      },
   });

   if(!loan){
      throw new Error("Loan not found.");
   };

   const updatedContract = await tx.contract.update({
      where: {
         id
      },
      data: {
         contractNo: data.contractNo,
         contractType: data.contractType,
         contractPhase: data.contractPhase,
         contractStatus: data.contractStatus,
         currency: data.currency,
         originalCurrency: data.originalCurrency,

         contractStartDate: data.contractStartDate
         ? new Date(data.contractStartDate)
         : null,

         contractRequestDate: data.contractRequestDate
         ? new Date(data.contractRequestDate)
         : null,

         contractEndPlannedDate: data.contractEndPlannedDate
         ? new Date(data.contractEndPlannedDate)
         : null,

         contractEndActualDate: data.contractEndActualDate
         ? new Date(data.contractEndActualDate)
         : null,

         firstPaymentDate: data.firstPaymentDate
         ? new Date(data.firstPaymentDate)
         : null,

         lastPaymentDate: data.lastPaymentDate
         ? new Date(data.lastPaymentDate)
         : null,

         nextPaymentDate: data.nextPaymentDate
         ? new Date(data.nextPaymentDate)
         : null,

         financedAmount: data.financedAmount,
         installmentsNumber: data.installmentsNumber,
         monthlyPaymentAmount: data.monthlyPaymentAmount,
         lastPaymentAmount: data.lastPaymentAmount,
         nextPaymentAmount: data.nextPaymentAmount,
         outstandingBalance: data.outstandingBalance,
         overduePaymentAmount: data.overduePaymentAmount,
         outstandingPaymentNumber:
         data.outstandingPaymentNumber,
         overduePaymentNumber:
         data.overduePaymentNumber,

         paymentPeriodicity:
         data.paymentPeriodicity,

         paymentMethod:
         data.paymentMethod,

         transactionType:
         data.transactionType,
   
      },
     
   });

const result = await tx.contractMonthlySnapshot.updateMany({
  where: {
    contractId: id,
    snapshotStatus: {
      in: ["DRAFT", "VALIDATED"],
    },
  },
  data: {
      contractEndActualDate:
         updatedContract.contractEndActualDate,

      financedAmount:
         updatedContract.financedAmount,

      outstandingBalance:
         updatedContract.outstandingBalance,

      lastPaymentAmount:
         updatedContract.lastPaymentAmount,

      lastPaymentDate:
         updatedContract.lastPaymentDate,

      nextPaymentAmount:
         updatedContract.nextPaymentAmount,

      nextPaymentDate:
         updatedContract.nextPaymentDate,

      snapshotStatus: "VALIDATED",
  },
});

   return updatedContract;
   })
}

