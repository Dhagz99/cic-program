import prisma from "../../lib/prisma";
import { removeSpecialCharacters } from "../utils/removeSpecialCharacters";


type GenerateReportParams = {

    batchId: string;
    userId: string;
    
 
 };
 
export const generateReportService =
async ({
   batchId,
   userId
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

         reportingPeriod: true

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

   const snapshots =
   await prisma.contractMonthlySnapshot.findMany({
      where: {
         branchId:
            batch.branchId,
         reportingPeriodId:
            batch.reportingPeriodId

      },

      include: {

         contract: {

            include: {

               client: true

            }

         }

      },

      orderBy: {

         createdAt: "asc"

      }

   });

/*
|--------------------------------------------------------------------------
| REPORT ROWS
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

   const uniqueClients =
   new Map();

for (
   const snapshot of
   snapshots
) {

   const client =
      snapshot.contract.client;

   uniqueClients.set(
      client.id,
      client
   );

}


   for (
      const client of
      uniqueClients.values()
   ) {

      const idRow = [

         "ID",

         client.providerCode || "",

         client.branchCode || "",

         reportDate,

         client.providerSubjectNo || "",

         client.title || "",

         client.firstName || "",

         client.lastName || "",

         client.middleName || "",

         client.suffix || "",

         client.nickname || "",

         client.prevLastName || "",

         client.genderCode || "",

         client.birthDate
            ? formatDate(
                 client.birthDate
              )
            : "",

         client.placeOfBirth || "",
         client.countryOfBirthCode || "PH",

         client.nationality || "PH",

         client.resident
            ? "1"
            : "0",
         client.civilStatusCode || "",

         client.numberOfDependents || "0",
         client.empty || "0",

         client.empty || "",
         client.empty || "",
         client.empty || "",

         client.empty || "",//Black

         client.empty || "", //Mother Maiden

         client.empty || "",//Black
         
         client.empty || "", //Father First Name
         client.empty || "", //Father Last Name
         client.empty || "", //Father Midlle Name
         client.empty || "", //Father Suffix Name

         client.addressType || "",

         client.address || "",

         client.empty || "", //Address 1: StreetNo
         client.empty || "", //Address 1: PostalCode
         client.empty || "", //Address 1: Subdivision
         client.empty || "", //Address 1: Barangay
         client.empty || "", //Address 1: City
         client.empty || "", //Address 1: Province
         client.empty || "", //Address 1:Country
         client.empty || "1", //Address 1: House Owner/Lessee
         client.empty || "", //Address 1: Occupied Since



         client.addressType2 || "",

         client.address2 || "",

         client.empty || "", //Address 2: StreetNo
         client.empty || "", //Address 2: PostalCode
         client.empty || "", //Address 2: Subdivision
         client.empty || "", //Address 2: Barangay
         client.empty || "", //Address 2: City
         client.empty || "", //Address 2: Province
         client.empty || "", //Address 2: Country
         client.empty || "", //Address 2: House Owner/Lessee
         client.empty || "", //Address 2: Occupied Since

         client.identificationTypeCode || "",
         client.identificationNumber ? removeSpecialCharacters(client.identificationNumber) : "",
         client.empty || "", //Identification 2: Type
         client.empty || "", //Identification 2: Number
         client.empty || "", //Identification 3: Type
         client.empty || "", //Identification 3: Number

         client.empty || "", //ID 1: Type
         client.empty || "", //ID 1: Number
         client.empty || "", //ID 1: IssueDate
         client.empty || "", //ID 1: IssueCountry
         client.empty || "", //ID 1: ExpiryDate
         client.empty || "", //ID 1: Issued By

         client.empty || "", //ID 2: Type
         client.empty || "", //ID 2: Number
         client.empty || "", //ID 2: IssueDate
         client.empty || "", //ID 2: IssueCountry
         client.empty || "", //ID 2: ExpiryDate
         client.empty || "", //ID 2: Issued By

         client.empty || "", //ID 3: Type
         client.empty || "", //ID 3: Number
         client.empty || "", //ID 3: IssueDate
         client.empty || "", //ID 3: IssueCountry
         client.empty || "", //ID 3: ExpiryDate
         client.empty || "", //ID 3: Issued By

         client.contactType || "",
         client.contactValue || "",

         client.empty || "", //Contact 2: Type
         client.empty || "", //Contact 2: Value

         client.empty || "", //Employment: Trade Name
         client.empty || "", //Employment: TIN
         client.empty || "", //Employment: Phone Number
         client.empty || "", //Employment:  PSIC
         client.empty || "0", //Employment: GrossIncome
         client.empty || "", //Employment: Annual/Monthly Indicator
         client.empty || "", //Employment: Currency
         client.empty || "", //Employment: OccupationStatus
         client.empty || "", //Employment: DateHiredFrom
         client.empty || "", //Employment: DateHiredTo
         client.empty || "", //Employment: Occupation

         client.empty || "", //Sole Trader:  TradeName
         client.empty || "", //Sole Trader 1: Address Type
         client.empty || "", //Sole Trader 1: FullAddress
         client.empty || "", //Sole Trader 1: StreetNo
         client.empty || "", //Sole Trader 1: PostalCode
         client.empty || "", //Sole Trader 1: Subdivision
         client.empty || "", //Sole Trader 1: Barangay
         client.empty || "", //Sole Trader 1: City
         client.empty || "", //Sole Trader 1: Province
         client.empty || "", //Sole Trader 1: Country
         client.empty || "", //Sole Trader 1: House Owner/Lessee
         client.empty || "", //Sole Trader 1: Occupied Since

         client.empty || "", //Sole Trader 2: Address Type
         client.empty || "", //Sole Trader 2: FullAddress
         client.empty || "", //Sole Trader 2: StreetNo
         client.empty || "", //Sole Trader 2: PostalCode
         client.empty || "", //Sole Trader 2: Subdivision
         client.empty || "", //Sole Trader 2: Barangay
         client.empty || "", //Sole Trader 2: City
         client.empty || "", //Sole Trader 2: Province
         client.empty || "", //Sole Trader 2: Country
         client.empty || "", //Sole Trader 2: House Owner/Lessee
         client.empty || "", //Sole Trader 2: Occupied Since

         client.empty || "", //Sole Trader 1:  Identification Type
         client.empty || "", //Sole Trader 1:  Identification Number
         client.empty || "", //Sole Trader 2:  Identification Type
         client.empty || "", //Sole Trader 2: Identification Number
         client.empty || "", //Sole Trader 1: Contact Type
         client.empty || "", //Sole Trader 1: Contact Value
         client.empty || "", //Sole Trader 2: Contact Type
         client.empty || "", //Sole Trader 2: Contact Value
    



      ].join("|");

      rows.push(idRow);

   }

   /*
   |--------------------------------------------------------------------------
   | CI RECORDS
   |--------------------------------------------------------------------------
   */

   for (
      const snapshot of
      snapshots
   ) {

      const contract =
         snapshot.contract;

         const ciRow = [

            "CI",

            contract.providerCode || "",
            "", //Branch Code

            reportDate,

            contract.providerSubjectNo || "",

            contract.role || "B",

            contract.contractNo || "",

            contract.contractType || "",

            contract.contractPhase || "",

            "",//Contract Status

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

            // contract.contractEndActualDate
            //    ? formatDate(
            //         contract.contractEndActualDate
            //      )
            //    : "",
            
            "", //contractEndActualDate

               contract.lastPaymentDate
               ? formatDate(
                    contract.lastPaymentDate
                 )
               : "",

            "", //Reorganized Credit Code
            "0", //Board Resolution flag
            contract.financedAmount?.toString() || "0",
            contract.installmentsNumber || "",
            contract.transactionType || "NA",
            "", //Purpose of credit


            contract.paymentPeriodicity || "M",

            contract.paymentMethod || "OTH",

            contract.monthlyPaymentAmount?.toString() || "0",

            contract.firstPaymentDate
               ? formatDate(
                    contract.firstPaymentDate
                 )
               : "",

           contract.lastPaymentAmount || "0",

            contract.nextPaymentDate
               ? formatDate(
                    contract.nextPaymentDate
                 )
               : "",

            contract.nextPaymentAmount?.toString() || "0",

            contract.outstandingPaymentNumber || "0",

            contract.outstandingBalance?.toString() || "0",

            contract.overduePaymentNumber || "0",

            contract.overduePaymentAmount?.toString() || "0",
           
            "0", //Overdue Days


            "", //Good Type
            "", //Good Value
            "", //New/Used Code
            "", //Good Brand
            "", //Manufacturing Date
            "", //Registration number
            "", //Provider Guarantee No 1
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type

        
            "", //Provider Guarantee No 2
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type

            "", //Provider Guarantee No 3
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type

            "", //Provider Guarantee No 4
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type

            "", //Provider Guarantee No 5
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type

            "", //Provider Guarantee No 6
            "", //Provider Subject No (Guarantor)
            "", //Guarantor Name
            "", //Guaranteed Amount
            "", //Currency
            "", //Validity Start Date
            "", //Validity End Date
            "", //Guarantee Type
            "", //Asset Code
            "", //Asset Description
            "", //Asset Location
            "", //Asset Appraised Value
            "", //Asset Registry External Link
            "", //Customer Type


            "", //Provider Subject No (Linked Subject 1)
            "", //Role
            "", //Name of the Linked Subject

            "", //Provider Subject No (Linked Subject 2)
            "", //Role
            "", //Name of the Linked Subject
           
            "", //Provider Subject No (Linked Subject 3)
            "", //Role
            "", //Name of the Linked Subject
           
            "", //Provider Subject No (Linked Subject 4)
            "", //Role
            "", //Name of the Linked Subject
           
            "", //Provider Subject No (Linked Subject 5)
            "", //Role
            "", //Name of the Linked Subject
           
            "", //Provider Subject No (Linked Subject 6)
            "", //Role
            "", //Name of the Linked Subject
           
         

           





         ].join("|");

         rows.push(ciRow);


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

      await prisma.cicExport.create({
         data: {

            importBatchId: batch.id,

            reportingPeriodId: batch.reportingPeriodId,
      
            branchId: batch.branchId,
      
            generatedById: userId ,
      
            fileName:  `PF007980_CSDF_${batch.id}.txt`,
      
            totalRecords: totalRecords,
      
            status: "Success"
         }
      });

   return {

      fileName:
         `PF007980_CSDF_${batch.id}.txt`,

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
                month: true,
                year: true

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


