// factory/seeds/general.domain.seed.ts

import prisma from "../../src/lib/prisma";




type DomainSeedItem = {

   code: string;

   description: string;

};

/*
|--------------------------------------------------------------------------
| REUSABLE SEEDER
|--------------------------------------------------------------------------
*/

async function seedDomain(

   type: string,

   items: DomainSeedItem[]

) {

   /*
   |--------------------------------------------------------------------------
   | REMOVE DUPLICATES
   |--------------------------------------------------------------------------
   */

   const uniqueItems =
      Array.from(

         new Map(

            items.map(item => [

               `${type}-${item.code}`,

               item

            ])

         ).values()

      );

   /*
   |--------------------------------------------------------------------------
   | UPSERT
   |--------------------------------------------------------------------------
   */

   for (const item of uniqueItems) {

      await prisma.domain.upsert({

         where: {

            type_code: {

               type,

               code: item.code

            }

         },

         update: {

            description:
               item.description

         },

         create: {

            type,

            code: item.code,

            description:
               item.description

         }

      });

   }

}

/*
|--------------------------------------------------------------------------
| MAIN SEED
|--------------------------------------------------------------------------
*/

export async function generalDomain() {

   /*
   |--------------------------------------------------------------------------
   | CONTRACT TYPE DOMAIN
   |--------------------------------------------------------------------------
   */

   const contractTypes: DomainSeedItem[] = [

      {
         code: "10",
         description: "Agricultural Loan"
      },

      {
         code: "11",
         description: "Loan Line"
      },

      {
         code: "12",
         description: "Personal Loan"
      },

      {
         code: "13",
         description: "Mortgage / Real Estate"
      },

      {
         code: "14",
         description: "Syndicated Loan"
      },

      {
         code: "15",
         description: "Term Loan"
      },

      {
         code: "16",
         description: "Short Term Loan"
      },

      {
         code: "17",
         description: "Vehicle Loan"
      },

      {
         code: "18",
         description: "Unsecured Loan"
      },

      {
         code: "19",
         description: "Home Equity Loan"
      },

      {
         code: "20",
         description: "Salary Loan"
      },

      {
         code: "21",
         description: "Provident Loan"
      },

      {
         code: "22",
         description: "Business Loan"
      },

      {
         code: "23",
         description: "Vehicle Leasing"
      },

      {
         code: "24",
         description: "Real Estate Leasing"
      },

      {
         code: "25",
         description: "Equipment Leasing"
      },

      {
         code: "26",
         description: "APEX Loan"
      },

      {
         code: "27",
         description: "Trust Loan"
      },

      {
         code: "28",
         description: "Benefit Loan"
      },

      {
         code: "29",
         description: "Time Loan"
      },

      {
         code: "60",
         description: "Student Loan"
      }

   ];

   /*
   |--------------------------------------------------------------------------
   | CONTRACT STATUS DOMAIN
   |--------------------------------------------------------------------------
   */

   const contractStatuses: DomainSeedItem[] = [

      {
         code: "DS",
         description:
            "Previous delinquency settled"
      },

      {
         code: "DA",
         description:
            "Debt Assumption"
      },

      {
         code: "NS",
         description:
            "There are unpaid amounts, Negotiated Settlement"
      },

      {
         code: "NP",
         description:
            "Under dispute / non performing"
      },

      {
         code: "PD",
         description:
            "Past Due"
      },

      {
         code: "DI",
         description:
            "Dispute Litigation contested"
      },

      {
         code: "CI",
         description:
            "Court injunction"
      },

      {
         code: "RP",
         description:
            "Repossession"
      },

      {
         code: "FC",
         description:
            "Foreclosure"
      },

      {
         code: "BR",
         description:
            "Bankruptcy request"
      },

      {
         code: "CP",
         description:
            "Blocked or Closed due to Restructuring"
      },

      {
         code: "WO",
         description:
            "Write-off (BLW)"
      },

      {
         code: "LT",
         description:
            "Under litigation / Delinquent"
      },

      {
         code: "WC",
         description:
            "Write-off and Credit transferred to third party / Collection"
      },

      {
         code: "MG",
         description:
            "Mandatory Grace Period - ECQ"
      }

   ];

   /*
   |--------------------------------------------------------------------------
   | CONTRACT PHASE DOMAIN
   |--------------------------------------------------------------------------
   */

   const contractPhases: DomainSeedItem[] = [

      {
         code: "RQ",
         description: "Requested"
      },

      {
         code: "RN",
         description: "Renounced"
      },

      {
         code: "RF",
         description: "Refused"
      },

      {
         code: "AC",
         description: "Active"
      },

      {
         code: "CL",
         description: "Closed"
      },

      {
         code: "CA",
         description: "Closed in advance"
      }

   ];

   /*
   |--------------------------------------------------------------------------
   | ROLE DOMAIN
   |--------------------------------------------------------------------------
   */

   const roles: DomainSeedItem[] = [

      {
         code: "B",
         description: "Borrower"
      },

      {
         code: "C",
         description: "Co-Borrower"
      },

      {
         code: "G",
         description: "Guarantor/Surety"
      }

   ];

   /*
   |--------------------------------------------------------------------------
   | TRANSACTION TYPE DOMAIN
   |--------------------------------------------------------------------------
   */

   const transactionTypes: DomainSeedItem[] = [

      {
         code: "NA",
         description: "NOT APPLICABLE"
      },

      {
         code: "AL",
         description: "AGRICULTURAL LOAN"
      },

      {
         code: "BD",
         description: "BILLS DISCOUNTED"
      },

      {
         code: "CAD",
         description:
            "CUSTOMERS' LIABILITY UNDER ACCEPTANCE - DOMESTIC"
      },

      {
         code: "CAF",
         description:
            "CUSTOMERS' LIABILITY UNDER ACCEPTANCE - FOREIGN"
      },

      {
         code: "DB",
         description:
            "DOMESTIC BILLS PURCHASED"
      },

      {
         code: "LCF",
         description:
            "DEFERRED LETTER OF CREDIT - FOREIGN"
      },

      {
         code: "LCD",
         description:
            "DEFERRED LETTER OF CREDIT - DOMESTIC"
      },

      {
         code: "DL",
         description: "DEMAND LOAN"
      },

      {
         code: "DC",
         description: "DOCS CREDIT"
      },

      {
         code: "EBP",
         description:
            "EXPORT BILLS PURCHASED"
      },

      {
         code: "EPC",
         description:
            "EXPORT PACKING CREDIT / EXPORT ADVANCES"
      },

      {
         code: "FBP",
         description:
            "FOREIGN BILLS PURCHASED"
      },

      {
         code: "IB",
         description: "IMPORT BILLS"
      },

      {
         code: "LCC",
         description:
            "LC CONFIRMATION"
      },

      {
         code: "CLD",
         description:
            "CASH LETTER OF CREDIT - DOMESTIC"
      },

      {
         code: "CLF",
         description:
            "CASH LETTER OF CR / SPOT LETTER OF CR - FOREIGN"
      },

      {
         code: "BUL",
         description:
            "BALANCE UNDER LOANS"
      },

      {
         code: "ML",
         description:
            "MARGIN LOAN"
      },

      {
         code: "MM",
         description:
            "MONEY MARKET"
      },

      {
         code: "STT",
         description:
            "ORDINARY SHORT TERM BANK TRANSACTION"
      },

      {
         code: "QL",
         description:
            "QUEDAN LOAN"
      },

      {
         code: "SG",
         description:
            "SHIPPING"
      },

      {
         code: "SBD",
         description:
            "SHIPSIDE BOND / BANK GUARANTY - DOMESTIC"
      },

      {
         code: "SBF",
         description:
            "SHIPSIDE BOND / BANK GUARANTY - FOREIGN"
      },

      {
         code: "SLD",
         description:
            "STANDBY LETTER OF CREDIT - DOMESTIC"
      },

      {
         code: "SLF",
         description:
            "STANDBY LETTER OF CREDIT - FOREIGN"
      },

      {
         code: "TRD",
         description:
            "TRUST RECEIPT - DOMESTIC"
      },

      {
         code: "TRF",
         description:
            "TRUST RECEIPTS - FOREIGN"
      },

      {
         code: "UID",
         description:
            "UNUSED LETTER OF CREDIT - DOMESTIC"
      },

      {
         code: "ULF",
         description:
            "UNUSED LETTER OF CREDIT - FOREIGN"
      },

      {
         code: "PCC",
         description:
            "Primary Credit Card"
      },

      {
         code: "SCC",
         description:
            "Supplementary Credit Card"
      },

      {
         code: "CCC",
         description:
            "CORPORATE CREDIT CARDS"
      },

      {
         code: "LI",
         description:
            "Life Insurance"
      },

      {
         code: "NLI",
         description:
            "Non-Life Insurance"
      },

      {
         code: "VUL",
         description:
            "Variable Unit Link-Insurance"
      },

      {
         code: "TI",
         description:
            "TERM Insurance"
      }

   ];

   /*
   |--------------------------------------------------------------------------
   | RUN SEEDS
   |--------------------------------------------------------------------------
   */

   await seedDomain(
      "CONTRACT_TYPE",
      contractTypes
   );

   await seedDomain(
      "CONTRACT_STATUS",
      contractStatuses
   );

   await seedDomain(
      "CONTRACT_PHASE",
      contractPhases
   );

   await seedDomain(
      "ROLE",
      roles
   );

   await seedDomain(
      "TRANSACTION_TYPE",
      transactionTypes
   );

   console.log(
      "General domain seed completed."
   );

}