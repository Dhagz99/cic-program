export interface ValidationErrorChecker {
   id: string;
   accountNo: string;
   providerSubjectNo: string;
   error: string;
};



export type ContractValidationError = {
   providerCode: string;
   errorType: 10 | 20;
   errorCode: number;
   description: string;
   contractNo: string;
   providerSubjectNo: string;
};

export type ContractValidationInput = {
   contractId: string | null;
   providerCode?: string | null;
   providerSubjectNo?: string | null;
   contractNo?: string | null;

   contractPhase?: string | null;

   contractStartDate?: Date | string | null;
   contractReferenceDate?: Date | string | null;
   contractEndPlannedDate?: Date | string | null;
   contractEndActualDate?: Date | string | null;

   lastPaymentDate?: Date | string | null;
   nextPaymentDate?: Date | string | null;

   nextPaymentAmount?: number | string | null;
   outstandingPaymentNumber?: number | string | null;
   installmentsNumber?: number | string | null;
};