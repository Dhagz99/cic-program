import { GetClientLoansParams } from "@repo/shared";
import prisma from "../../lib/prisma";

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

   const latestContracts =
      await prisma.contract.groupBy({

         by: [
            "providerSubjectNo"
         ],

         where:
            whereCondition,

         _max: {
            createdAt: true
         }

      });

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
      latestContracts.length;

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

         totalLoan,

         page,

         limit,

         totalPages:

            Math.ceil(
               totalLoan / limit
            )

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