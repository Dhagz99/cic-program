// contract/applyRenewalPayments.service.ts

import { normalizeLastPaymentDate } from "../../utils/normalizeLastPaymentDate";

export type ContractTempItem = {
   rowNo: number;

   providerSubjectNo: string;

   hasPreviousSnapshot: boolean;

   contract: {
      contractNo: string | null;

      contractRequestDate: Date | null;

      contractStartDate: Date | null;

      principalAmount: number | null;

      outstandingBalance: number | null;

      monthlyPaymentAmount: number | null;

      lastPaymentAmount: number | null;

      lastPaymentDate: Date | null;

      loanType: string | null;

      contractPhase: string | null;

      [key: string]: any;
   };

   validationErrors: any[];
};


export const applyRenewalPayments = (
   contracts: ContractTempItem[]
) => {

   /*
   --------------------------------
   GROUP CONTRACTS BY CLIENT
   --------------------------------
   */

   const contractsByClient =
      new Map<
         string,
         ContractTempItem[]
      >();


   for (const item of contracts) {

      const current =
         contractsByClient.get(
            item.providerSubjectNo
         ) ?? [];

      current.push(item);

      contractsByClient.set(
         item.providerSubjectNo,
         current
      );
   }


   /*
   --------------------------------
   PROCESS EACH CLIENT
   --------------------------------
   */

   for (
      const clientContracts
      of contractsByClient.values()
   ) {

      /*
      Oldest -> newest
      */

      clientContracts.sort((a, b) => {

         const dateA =
            a.contract
               .contractRequestDate
               ?.getTime() ?? 0;

         const dateB =
            b.contract
               .contractRequestDate
               ?.getTime() ?? 0;

         return dateA - dateB;
      });


      /*
      Prevent the same old contract
      from being assigned to multiple
      renewal contracts.
      */

      const usedOldContracts =
         new Set<string>();


      /*
      --------------------------------
      PROCESS RENEWAL CONTRACTS
      --------------------------------
      */

      for (
         let index = 0;
         index < clientContracts.length;
         index++
      ) {

         const newContract =
            clientContracts[index];


         /*
         --------------------------------
         NEW CONTRACT MUST BE RENEWAL
         --------------------------------
         */

         const isRenewal =
            newContract.contract.loanType === "C";

         if (!isRenewal) {
            continue;
         }


         const newContractNo =
            newContract.contract.contractNo;

         const newRequestDate =
            newContract.contract.contractRequestDate;

         const newMonthlyPayment =
            newContract.contract.monthlyPaymentAmount;


         if (
            !newContractNo ||
            !newRequestDate ||
            newMonthlyPayment === null
         ) {
            continue;
         }


         /*
         --------------------------------
         FIND OLD CONTRACT
         --------------------------------

         Find the most recent older contract:

         - same client
         - different contract number
         - same monthly payment
         - request date before renewal
         - not already used
         */

         const oldContract =
            clientContracts

               .filter((candidate) => {

                  const candidateNo =
                     candidate.contract.contractNo;

                  const candidateDate =
                     candidate.contract
                        .contractRequestDate;

                  const candidateMonthly =
                     candidate.contract
                        .monthlyPaymentAmount;


                  /*
                  Required values
                  */

                  if (
                     !candidateNo ||
                     !candidateDate ||
                     candidateMonthly === null
                  ) {
                     return false;
                  }


                  /*
                  Same contract is not allowed
                  */

                  if (
                     candidateNo ===
                     newContractNo
                  ) {
                     return false;
                  }


                  /*
                  Already matched to another
                  renewal
                  */

                  if (
                     usedOldContracts.has(
                        candidateNo
                     )
                  ) {
                     return false;
                  }


                  /*
                  Old contract must have been
                  requested before renewal.
                  */

                  if (
                     candidateDate.getTime() >=
                     newRequestDate.getTime()
                  ) {
                     return false;
                  }


                  /*
                  Same loan series based on
                  monthly payment.
                  */

                  if (
                     candidateMonthly !==
                     newMonthlyPayment
                  ) {
                     return false;
                  }


                  return true;
               })


               /*
               Most recent matching old
               contract first.
               */

               .sort((a, b) => {

                  const dateA =
                     a.contract
                        .contractRequestDate
                        ?.getTime() ?? 0;

                  const dateB =
                     b.contract
                        .contractRequestDate
                        ?.getTime() ?? 0;

                  return dateB - dateA;
               })[0];


         /*
         No matching old contract.
         */

         if (!oldContract) {
            continue;
         }


         const oldContractNo =
            oldContract.contract.contractNo;

         if (!oldContractNo) {
            continue;
         }


         /*
         --------------------------------
         ALREADY CLOSED
         --------------------------------

         DBF already says this contract is
         closed.

         Preserve:
         - lastPaymentAmount
         - lastPaymentDate
         */

         const isAlreadyClosed =
            oldContract.contract
               .contractPhase === "CL";

         if (isAlreadyClosed) {

            usedOldContracts.add(
               oldContractNo
            );

            continue;
         }


         /*
         --------------------------------
         PREVIOUS SNAPSHOT EXISTS
         --------------------------------

         Snapshot processing already
         calculated the payment amount.

         Example:

         Previous balance = 13,000
         Current balance  = 2,600

         Payment = 10,400

         DO NOT replace that amount with:

         principal - balance
         */

         if (
            oldContract.hasPreviousSnapshot
         ) {

            /*
            Preserve snapshot payment amount.

            If snapshot processing did not
            provide a payment date, use the
            renewal request date.
            */

            if (
               oldContract.contract
                  .lastPaymentDate === null
            ) {

               oldContract.contract
                  .lastPaymentDate =
                     newRequestDate;
            }


            usedOldContracts.add(
               oldContractNo
            );


            console.log(
               "RENEWAL SNAPSHOT",
               {
                  oldContractNo,

                  newContractNo,

                  oldHasPreviousSnapshot:
                     oldContract
                        .hasPreviousSnapshot,

                  oldLastPaymentAmount:
                     oldContract
                        .contract
                        .lastPaymentAmount,

                  oldLastPaymentDate:
                     oldContract
                        .contract
                        .lastPaymentDate,

                  newRequestDate
               }
            );


            continue;
         }


         /*
         --------------------------------
         NO PREVIOUS SNAPSHOT
         --------------------------------

         The old loan was renewed before
         we collected a previous monthly
         snapshot.

         For this case the renewal closes
         the old loan.

         Example:

         9656
         Principal = 46,800
         Balance   =  3,900

         Last Payment =
            46,800 - 3,900
            = 42,900

         New contract 9946 request date:
            04/28/2026

         Therefore:

         9656 Last Payment      = 42,900
         9656 Last Payment Date = 04/28/2026
         */

         const principalAmount =
            oldContract.contract
               .principalAmount;

         const outstandingBalance =
            oldContract.contract
               .outstandingBalance;


         /*
         --------------------------------
         LAST PAYMENT AMOUNT
         --------------------------------

         IMPORTANT:

         Do NOT preserve the normal DBF
         fallback amount here.

         A renewal without a previous
         snapshot uses:

         principal - outstanding balance
         */

         if (
            principalAmount !== null &&
            outstandingBalance !== null
         ) {

            const payment =
               principalAmount -
               outstandingBalance;


            oldContract.contract
               .lastPaymentAmount =
                  payment > 0
                     ? payment
                     : null;
         }


         /*
         --------------------------------
         LAST PAYMENT DATE
         --------------------------------

         The new renewal request date is
         the final payment date of the old
         contract.

         Do NOT check whether the existing
         date is null because normalizeContract
         may already have populated a fallback
         date.
         */

         oldContract.contract
            .lastPaymentDate =
               newRequestDate;


         /*
         --------------------------------
         DEBUG
         --------------------------------
         */

         console.log(
            "RENEWAL FALLBACK",
            {
               oldContractNo,

               newContractNo,

               oldHasPreviousSnapshot:
                  oldContract
                     .hasPreviousSnapshot,

               oldLastPaymentAmount:
                  oldContract
                     .contract
                     .lastPaymentAmount,

               oldLastPaymentDate:
                  oldContract
                     .contract
                     .lastPaymentDate,

               oldBalance:
                  oldContract
                     .contract
                     .outstandingBalance,

               oldPrincipal:
                  oldContract
                     .contract
                     .principalAmount,

               newRequestDate,

               newLoanType:
                  newContract
                     .contract
                     .loanType
            }
         );


         /*
         Prevent another renewal contract
         from matching this same old loan.
         */

         usedOldContracts.add(
            oldContractNo
         );
      }
   }


   /*
   --------------------------------
   NORMALIZE PAYMENT DATES
   --------------------------------

   Run this only AFTER all renewal
   processing has finished.
   */

   for (const item of contracts) {

      normalizeLastPaymentDate(
         item.contract
      );
   }
};