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
                  Old contract must exist before
                  the renewal contract.
                  */

                  if (
                     candidateDate.getTime() >=
                     newRequestDate.getTime()
                  ) {
                     return false;
                  }


                  /*
                  Match loan series based on
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

         If DBF already says this contract
         is closed, preserve its existing:

         - lastPaymentAmount
         - lastPaymentDate
         */

         const isAlreadyClosed =
            oldContract.contract
               .contractPhase === "CL";

         if (isAlreadyClosed) {
            continue;
         }


         /*
         --------------------------------
         PREVIOUS SNAPSHOT EXISTS
         --------------------------------

         Snapshot calculation already
         produced the correct payment amount.

         Example:

         April balance = 13,000
         May balance   = 2,600

         lastPaymentAmount = 10,400

         DO NOT replace this with:

         principal - balance
         */

         if (
            oldContract.hasPreviousSnapshot
         ) {

            /*
            But if payment date is missing,
            the renewal request date is the
            final payment date of the old loan.
            */

            if (
               oldContract.contract
                  .lastPaymentDate === null
            ) {
               oldContract.contract
                  .lastPaymentDate =
                     newRequestDate;
            }


            /*
            Prevent another renewal from
            using this old contract.
            */

            usedOldContracts.add(
               oldContractNo
            );


            console.log(
               "RENEWAL SNAPSHOT",
               {
                  oldContractNo,

                  newContractNo,

                  hasPreviousSnapshot:
                     oldContract
                        .hasPreviousSnapshot,

                  lastPaymentAmount:
                     oldContract
                        .contract
                        .lastPaymentAmount,

                  lastPaymentDate:
                     oldContract
                        .contract
                        .lastPaymentDate
               }
            );


            continue;
         }


         /*
         --------------------------------
         NO PREVIOUS SNAPSHOT
         --------------------------------

         This handles the special case:

         Old loan was renewed before the
         system collected a monthly snapshot.
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

         Preserve an existing DBF payment
         amount if it already exists.

         Only calculate the fallback when
         lastPaymentAmount is missing.

         Business rule:

         principal - current balance
         */

         if (
            oldContract.contract
               .lastPaymentAmount === null
         ) {

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
         }


         /*
         --------------------------------
         LAST PAYMENT DATE
         --------------------------------

         If old contract has no payment date,
         use the new renewal's request date.
         */

         if (
            oldContract.contract
               .lastPaymentDate === null
         ) {

            oldContract.contract
               .lastPaymentDate =
                  newRequestDate;
         }


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
         
           for (const item of contracts) {
               normalizeLastPaymentDate(
                  item.contract
               );
           }
      }
   }
};