export type ImportStatus =
   | "UPLOADED"
   | "PROCESSING"
   | "PENDING_COMPLETION"
   | "FOR_REVIEW"
   | "RETURNED"
   | "APPROVED"
   | "FINALIZED";

export interface ValidationError {

   id: string;

   fieldName: string;

   errorMessage: string;

}

export interface StagingContract {

   id: string;

   contractNo: string;

   financedAmount: string;

   validationStatus: string;

   isConfirmed: boolean;

   validationErrors: ValidationError[];

}

export interface StagingClient {

   id: string;

   providerSubjectNo: string;

   firstName: string;

   middleName?: string;

   lastName: string;

   address?: string;

   tinNumber?: string;

   validationStatus: string;

   isConfirmed: boolean;

   validationErrors: ValidationError[];

   stagingContracts: StagingContract[];

}

export interface ImportBatch {

   id: string;

   fileName: string;

   status: ImportStatus;

   totalRecords: number;

   completedRecords: number;

   errorRecords: number;

   createdAt: string;

}