
import prisma from "../../lib/prisma";

type DashboardParams = {
   branchId?: string;
   isAdmin: boolean;
};

export async function DashboardServices({
   branchId,
   isAdmin
}: DashboardParams) {

   /*
   -----------------------------------
   FILTER
   -----------------------------------
   */

   const branchFilter =
      isAdmin
         ? {}
         : {
              branchId
           };

   /*
   -----------------------------------
   TOTAL BORROWERS
   -----------------------------------
   */

   const totalBorrowersPromise =
      prisma.client.count({
         where: branchFilter
      });

   /*
   -----------------------------------
   TOTAL ACTIVE LOANS
   -----------------------------------
   */

   const totalActiveLoansPromise =
      prisma.contract.count({

         where: {

            ...branchFilter,

            contractPhase: "AC"

         }

      });

   /*
   -----------------------------------
   TOTAL LOAN AMOUNT
   -----------------------------------
   */

   const totalLoanAmountPromise =
      prisma.contract.aggregate({

         where:
            branchFilter,

         _sum: {

            financedAmount: true

         }

      });

   /*
   -----------------------------------
   TOTAL CIC EXPORTS
   -----------------------------------
   */

   const totalExportsPromise =
      prisma.cicExport.count({
         where: branchFilter
      });

   /*
   -----------------------------------
   BRANCH SUMMARY
   -----------------------------------
   */

   const branchesPromise =
      prisma.branch.findMany({

         select: {

            id: true,

            branchCode: true,

            branchName: true,

            _count: {

               select: {

                  clients: true

               }

            },

            contracts: {

               where: {

                  contractPhase: "AC"

               },

               select: {

                  financedAmount: true

               }

            }

         },

         orderBy: {

            branchName: "asc"

         }

      });



      /* 
      ----------------------
      MONTHLY TREND
      ---------------------
      */

      const currentYear =
   new Date().getFullYear();

const monthlyContracts =
   await prisma.contract.findMany({

      where: {

         ...branchFilter,

         contractStartDate: {

            gte: new Date(
               currentYear,
               0,
               1
            ),

            lte: new Date(
               currentYear,
               11,
               31
            )

         }

      },

      select: {

         contractStartDate: true,

         financedAmount: true,

         providerSubjectNo: true

      }

   });

   const monthlyLoanTrendPromise =
   Array.from(
      { length: 12 },
      (_, index) => {

         const monthRecords =
            monthlyContracts.filter(
               item =>
                  item.contractStartDate &&
                  item.contractStartDate.getMonth() === index
            );

         return {

            month:

               new Date(
                  currentYear,
                  index
               ).toLocaleString(
                  "en-US",
                  {
                     month: "short"
                  }
               ),

            borrowers:

               new Set(
                  monthRecords.map(
                     x =>
                        x.providerSubjectNo
                  )
               ).size,

            loans:
               monthRecords.length,

            amount:

               monthRecords.reduce(

                  (sum, record) =>

                     sum +

                     Number(
                        record.financedAmount || 0
                     ),

                  0

               )

         };

      }
   );


   /* 
      ----------------------
      CURRENT VS PREVIOUS MONTH
      ---------------------
    */

    const monthsWithData =
      monthlyLoanTrendPromise.filter(
         item =>
            item.borrowers > 0 ||
            item.loans > 0 ||
            item.amount > 0
      );
   
   const currentMonth =
      monthsWithData[
         monthsWithData.length - 1
      ];
   
   const previousMonth =
      monthsWithData[
         monthsWithData.length - 2
      ];
   
   const calculateGrowth = (
      current: number,
      previous: number
   ) => {
   
      if (!previous) {
         return 0;
      }
   
      return Number(
         (
            ((current - previous) / previous) * 100
         ).toFixed(1)
      );
   
   };
   
   const borrowerGrowth =
      calculateGrowth(
         currentMonth?.borrowers || 0,
         previousMonth?.borrowers || 0
      );
   
   const activeLoanGrowth =
      calculateGrowth(
         currentMonth?.loans || 0,
         previousMonth?.loans || 0
      );
   
   const loanAmountGrowth =
      calculateGrowth(
         currentMonth?.amount || 0,
         previousMonth?.amount || 0
      );


   const [

      totalBorrowers,

      totalActiveLoans,

      totalLoanAmount,

      totalExports,

      branches,
      monthlyLoanTrends,
      
   

   ] = await Promise.all([

      totalBorrowersPromise,

      totalActiveLoansPromise,

      totalLoanAmountPromise,

      totalExportsPromise,

      branchesPromise,

      monthlyLoanTrendPromise,

  

   ]);

   return {

      totalBorrowers,

      totalActiveLoans,

      totalLoanAmount:

         Number(
            totalLoanAmount
               ._sum
               .financedAmount || 0
         ),

      totalExports,

      monthlyLoanTrends,

      branches:

         branches.map(
            (branch) => ({

               branchId:
                  branch.id,

               branchCode:
                  branch.branchCode,

               branchName:
                  branch.branchName,

               totalBorrowers:
                  branch._count.clients,

               totalActiveLoans:
                  branch.contracts.length,

               totalLoanAmount:

                  branch.contracts.reduce(

                     (sum, contract) =>

                        sum +

                        Number(
                           contract.financedAmount || 0
                        ),

                     0

                  )

            })
         ),

         borrowerGrowth,

         activeLoanGrowth,
      
         loanAmountGrowth,

   };

}