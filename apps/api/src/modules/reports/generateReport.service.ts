import prisma from "../../lib/prisma";


type GenerateReportParams = {

    batchId: string;
 
 };
 
export const generateReportService =
async ({
   batchId
}: GenerateReportParams) => {

   /*
   |--------------------------------------------------------------------------
   | FIND BATCH
   |--------------------------------------------------------------------------
   */

   const batch =
      await prisma.importBatch.findUnique({

         where: {
            id: batchId
         },

         include: {

            branch: true,

            reportingPeriod: true,

            cleints: {

               include: {

                  Contracts: true

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
   | REPORT DATE
   |--------------------------------------------------------------------------
   */

   const reportDate =
      getLastDayOfMonth(

         batch.reportingPeriod.year,

         batch.reportingPeriod.month

      );

   /*
   |--------------------------------------------------------------------------
   | FILE ROWS
   |--------------------------------------------------------------------------
   */

   const rows: string[] = [];

   /*
   |--------------------------------------------------------------------------
   | HEADER
   |--------------------------------------------------------------------------
   */

   const headerRow = [

      "HD",

      "PF007980",

      reportDate,

      "1.0",

      "1",

      `EMB CAPITAL LENDING TEST DATA - ${
         getMonthName(
            batch.reportingPeriod.month
         ).toUpperCase()
      } ${batch.reportingPeriod.year}`

   ].join("|");

   rows.push(headerRow);

   /*
   |--------------------------------------------------------------------------
   | ID RECORDS
   |--------------------------------------------------------------------------
   */

   for (
      const client of
      batch.cleints
   ) {

      const idRow = [

         "ID",

         client.providerCode || "",

         reportDate,

         client.providerSubjectNo || "",

         client.firstName || "",

         client.middleName || "",

         client.lastName || "",

         client.suffix || "",

         client.genderCode || "",

         client.birthDate
            ? formatDate(
                 client.birthDate
              )
            : "",

         client.countryOfBirthCode || "PH",

         client.nationality || "PH",

         client.resident
            ? "1"
            : "0",

         client.civilStatusCode || "",

         client.numberOfDependents || "0",

         client.addressType || "",

         client.address || "",

         client.addressType2 || "",

         client.address2 || "",

         client.identificationTypeCode || "",

         client.identificationNumber || "",

         client.contactType || "",

         client.contactValue || ""

      ].join("|");

      rows.push(idRow);

   }

   /*
   |--------------------------------------------------------------------------
   | CI RECORDS
   |--------------------------------------------------------------------------
   */

   for (
      const client of
      batch.cleints
   ) {

      for (
         const contract of
         client.Contracts
      ) {

         const ciRow = [

            "CI",

            contract.providerCode || "",

            reportDate,

            contract.providerSubjectNo || "",

            contract.role || "B",

            contract.contractNo || "",

            contract.contractType || "",

            contract.contractPhase || "",

            contract.currency || "PHP",

            contract.originalCurrency || "PHP",

            contract.contractStartDate
               ? formatDate(
                    contract.contractStartDate
                 )
               : "",

            contract.contractRequestDate
               ? formatDate(
                    contract.contractRequestDate
                 )
               : "",

            contract.contractEndPlannedDate
               ? formatDate(
                    contract.contractEndPlannedDate
                 )
               : "",

            contract.contractEndActualDate
               ? formatDate(
                    contract.contractEndActualDate
                 )
               : "",

            contract.contractStatus || "",

            contract.financedAmount?.toString() || "0",

            contract.installmentsNumber || "",

            contract.transactionType || "NA",

            contract.paymentPeriodicity || "M",

            contract.paymentMethod || "OTH",

            contract.monthlyPaymentAmount?.toString() || "0",

            contract.firstPaymentDate
               ? formatDate(
                    contract.firstPaymentDate
                 )
               : "",

            contract.lastPaymentAmount?.toString() || "0",

            contract.nextPaymentDate
               ? formatDate(
                    contract.nextPaymentDate
                 )
               : "",

            contract.nextPaymentAmount?.toString() || "0",

            contract.outstandingPaymentNumber || "",

            contract.outstandingBalance?.toString() || "0",

            contract.overduePaymentNumber || "",

            contract.overduePaymentAmount?.toString() || "0"

         ].join("|");

         rows.push(ciRow);

      }

   }

   /*
   |--------------------------------------------------------------------------
   | FOOTER
   |--------------------------------------------------------------------------
   */

   const totalRecords =
      rows.length - 1;

   const footerRow = [

      "FT",

      "PF007980",

      reportDate,

      totalRecords

   ].join("|");

   rows.push(footerRow);

   /*
   |--------------------------------------------------------------------------
   | FINAL CONTENT
   |--------------------------------------------------------------------------
   */

   const content =
      rows.join("\n");

   return {

      fileName:
         `CIC_REPORT_${batch.id}.txt`,

      content

   };

};

/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

function formatDate(
   date: Date
): string {

   const day =
      String(
         date.getDate()
      ).padStart(2, "0");

   const month =
      String(
         date.getMonth() + 1
      ).padStart(2, "0");

   const year =
      date.getFullYear();

   return `${day}${month}${year}`;

}

/*
|--------------------------------------------------------------------------
| LAST DAY OF MONTH
|--------------------------------------------------------------------------
*/

function getLastDayOfMonth(
   year: number,
   month: number
): string {

   const lastDate =
      new Date(
         year,
         month,
         0
      );

   return formatDate(
      lastDate
   );

}

/*
|--------------------------------------------------------------------------
| MONTH NAME
|--------------------------------------------------------------------------
*/

function getMonthName(
   month: number
): string {

   const months = [

      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"

   ];

   return months[month - 1];

}


export const getImportBatchesService =
async () => {

   return prisma.importBatch.findMany({

      where: {

         status:
            "FINALIZED"

      },

      include: {

         branch: {

            select: {

               id: true,
               branchName: true

            }

         },

         reportingPeriod: {

            select: {

               id: true,
                month: true

            }

         }

      },

      orderBy: {

         createdAt:
            "desc"

      }

   });

};


export const getReportingPeriodsService =
async () => {

   return prisma.reportingPeriod.findMany({

      orderBy: [

         {
            year: "desc"
         },

         {
            month: "desc"
         }

      ]

   });

};
