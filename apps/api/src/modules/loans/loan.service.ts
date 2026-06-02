import { GetClientLoansParams } from "@repo/shared";
import prisma from "../../lib/prisma";

export async function getClientLoansServices({
   branchId,
   page = 1,
   limit = 10,
   search = "",
   contractPhase
}: GetClientLoansParams) {

   /*
   -----------------------------------
   BASE FILTER
   -----------------------------------
   */

   const whereCondition = {

      branchId,

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

   const latestWhere = {

      OR:

         latestContracts.map(
            (item) => ({

               providerSubjectNo:
                  item.providerSubjectNo,

               createdAt:
                  item._max.createdAt!

            })
         )

   };

   /*
   -----------------------------------
   TOTAL LATEST RECORDS
   -----------------------------------
   */

   const total =
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
      pastDueLoans
   ] = await Promise.all([

      prisma.contract.findMany({

         where:
            latestWhere,

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

         where: {

            branchId

         },

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
               latestWhere,
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
            branchId,
            contractStatus:
               "PAST_DUE"

         }

      })

   ]);

   return {

      data:
         contracts,

      pagination: {

         total,

         page,

         limit,

         totalPages:

            Math.ceil(
               total / limit
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

         pastDueLoans

      }

   };

}