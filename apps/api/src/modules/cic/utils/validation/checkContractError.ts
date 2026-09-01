import { ContractValidationInput, ValidationErrorChecker } from "@repo/shared";

export function checkContractErrors(data: ContractValidationInput): ValidationErrorChecker[] {
   const errors: ValidationErrorChecker[] = [];

   const phase = (data.contractPhase ?? "").toUpperCase();

   const addError = (message: string) => {
      errors.push({
         accountNo: data.contractNo ?? "",
         providerSubjectNo: data.providerSubjectNo ?? "",
         error: message,
         id: data.contractId ?? "",
      });
   };

   

   // Outstanding Payment > Installments
   if (
      ["AC", "CL", "CA"].includes(phase) &&
      Number(data.outstandingPaymentNumber) > 0 &&
      Number(data.outstandingPaymentNumber) >
         Number(data.installmentsNumber)
   ) {
      addError(
         "Outstanding Payment Number is greater than Installments Number."
      );
   }

   // Contract Start Date > Last Payment Date
   if (
      data.contractStartDate &&
      data.lastPaymentDate &&
      new Date(data.contractStartDate) >
         new Date(data.lastPaymentDate)
   ) {
      addError(
         "Contract Start Date is greater than Last Payment Date."
      );
   }

   // Closed contract with Next Payment Date
   if (
      ["CL", "CA"].includes(phase) &&
      data.nextPaymentDate
   ) {
      addError(
         "Closed contract should not have a Next Payment Date."
      );
   }

   // Closed contract with Next Payment Amount
   if (
      ["CL", "CA"].includes(phase) &&
      Number(data.nextPaymentAmount) !== 0
   ) {
      addError(
         "Closed contract should have Next Payment Amount = 0."
      );
   }

   // Closed contract without Actual End Date
   if (
      ["CL", "CA"].includes(phase) &&
      !data.contractEndActualDate
   ) {
      addError(
         "Closed contract is missing Contract End Actual Date."
      );
   }

   // Reference Date > Last Payment Date
   if (
      data.contractReferenceDate &&
      data.lastPaymentDate &&
      new Date(data.contractReferenceDate) >
         new Date(data.lastPaymentDate)
   ) {
      addError(
         "Contract Reference Date is greater than Last Payment Date."
      );
   }

   // Planned End Date < Next Payment Date
   if (
      data.contractEndPlannedDate &&
      data.nextPaymentDate &&
      new Date(data.contractEndPlannedDate) <
         new Date(data.nextPaymentDate)
   ) {
      addError(
         "Contract End Planned Date is earlier than Next Payment Date."
      );
   }

   return errors;
}