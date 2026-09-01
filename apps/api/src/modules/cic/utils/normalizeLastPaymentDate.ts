import { ContractTempItem } from "../services/contract/applyRenewalPayments.service";

export const normalizeLastPaymentDate = (
   contract: ContractTempItem["contract"]
) => {
   const contractStartDate =
      contract.contractStartDate;

   const lastPaymentDate =
      contract.lastPaymentDate;

   if (
      !contractStartDate ||
      !lastPaymentDate
   ) {
      return;
   }

   if (
      contractStartDate.getTime() >
      lastPaymentDate.getTime()
   ) {
      contract.lastPaymentDate =
         contractStartDate;
   }
};