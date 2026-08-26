import prisma from "../../lib/prisma";


export const loadPreviousContractSnapshotCache =
   async ({
      branchId,
      reportingPeriodId,
   }: {
      branchId: string;
      reportingPeriodId: string;
   }) => {

      const currentPeriod =
         await prisma.reportingPeriod.findUnique({
            where: {
               id: reportingPeriodId,
            },
            select: {
               id: true,
               year: true,
               month: true,
            },
         });

      if (!currentPeriod) {
         throw new Error(
            "Reporting period not found"
         );
      }

      const previousPeriod =
         await prisma.reportingPeriod.findFirst({
            where: {
               OR: [
                  {
                     year: {
                        lt: currentPeriod.year,
                     },
                  },
                  {
                     year:
                        currentPeriod.year,

                     month: {
                        lt: currentPeriod.month,
                     },
                  },
               ],
            },

            orderBy: [
               {
                  year: "desc",
               },
               {
                  month: "desc",
               },
            ],

            select: {
               id: true,
            },
         });

      const cache =
         new Map<string, number | null>();

      if (!previousPeriod) {
         return cache;
      }

      const snapshots =
         await prisma.contractMonthlySnapshot.findMany({
            where: {
               branchId,
               reportingPeriodId:
                  previousPeriod.id,
            },

            select: {
                
               contract: {
                select: {
                    contractNo: true
                }
               },
               outstandingBalance: true,

            },
         });

      for (const snapshot of snapshots) {
         if (!snapshot.contract.contractNo) {
            continue;
         }

         const contractNo =
            snapshot.contract.contractNo.trim();

         cache.set(
            contractNo,
            snapshot.outstandingBalance
               ?.toNumber() ?? null
         );
      }

      return cache;
   };