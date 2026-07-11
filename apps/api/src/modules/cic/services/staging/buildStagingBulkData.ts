import { ValidationStatus } from "@prisma/client";

export const getValidationStatus = (
   validationErrors: any[]
): ValidationStatus => {
   return validationErrors.length > 0
      ? ValidationStatus.WITH_ERRORS
      : ValidationStatus.COMPLETE;
};

export const buildStagingClientData = ({
   batchId,
   rowNo,
   client,
   validationErrors
}: any) => {
   return {
      batchId,
      rowNo,

      providerSubjectNo:
         client.providerSubjectNo,

      firstName:
         client.firstName,

      middleName:
         client.middleName,

      lastName:
         client.lastName,

      suffix:
         client.suffix,

      birthDate:
         client.birthDate
            ? client.birthDate
            : null,

      address:
         client.address,

      addressCity:
         client.addressCity,

      addressBarangay:
         client.addressBarangay,

      addressProvince:
         client.addressProvince,

      addressPostalCode:
         client.addressPostalCode,

      address2:
         client.address,

      identificationTypeCode:
         client.grouping ?? null,

      identificationNumber:
         client.sssNo,


      validationStatus:
         getValidationStatus(validationErrors)
   };
};

export const buildStagingContractData = ({
   batchId,
   stagingClientId,
   rowNo,
   contract,
   validationErrors
}: any) => {
   return {
      batchId,
      stagingClientId,
      rowNo,

      providerSubjectNo:
         contract.providerSubjectNo,

      contractNo:
         contract.contractNo,

      contractStartDate:
         contract.contractStartDate,

      contractRequestDate:
         contract.contractRequestDate,

      contractEndPlannedDate:
         contract.contractEndPlannedDate,

      contractEndActualDate:
         contract.contractEndPlannedDate,

      lastPaymentDate:
         contract.lastPaymentDate,

      financedAmount:
         contract.financedAmount,

      installmentsNumber:
         contract.installmentsNumber,

      monthlyPaymentAmount:
         contract.monthlyPaymentAmount,

      firstPaymentDate:
         contract.firstPaymentDate,

      lastPaymentAmount:
         contract.lastPaymentAmount,

      nextPaymentDate:
         contract.nextPaymentDate,

      nextPaymentAmount:
         contract.nextPaymentAmount,

      outstandingPaymentNumber:
         contract.outstandingPaymentNumber,

      outstandingBalance:
         contract.outstandingBalance,

      contractStatus:
         contract.contractStatus,

      contractPhase:
         contract.contractPhase,

      validationStatus:
         getValidationStatus(validationErrors)
   };
};



export const buildDailyStagingClientData = ({
   dailyId,
   rowNo,
   client,
   validationErrors
}: any) => {
   return {
      dailyId,
      rowNo,

      providerSubjectNo:
         client.providerSubjectNo,

      firstName:
         client.firstName,

      middleName:
         client.middleName,

      lastName:
         client.lastName,

      suffix:
         client.suffix,

      birthDate:
         client.birthDate
            ? client.birthDate
            : null,

      address:
         client.address,

      addressCity:
         client.addressCity,

      addressBarangay:
         client.addressBarangay,

      addressProvince:
         client.addressProvince,

      addressPostalCode:
         client.addressPostalCode,

      address2:
         client.address,

      identificationTypeCode:
         client.grouping ?? null,

      identificationNumber:
         client.sssNo,


      validationStatus:
         getValidationStatus(validationErrors)
   };
};