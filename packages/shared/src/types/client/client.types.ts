export interface GetClientsParams {
    branchId?: string;
    page?: number;
    limit?: number;
    search?: string;
    genderCode?: string;
    civilStatusCode?: number;
    isAdmin?: boolean;
 }


 export interface GetClientLoansParams {
    branchId?: string;
    page?: number;
    limit?: number;
    search?: string;
    contractPhase?: string;
    isAdmin?: boolean;
 }




 // types/client-loan.ts   

export interface ClientLoan {

   id: string;

   recordType: string;

   providerCode: string;

   branchId: string;

   branchCode: string | null;

   batchId: string;

   clientId: string;

   providerSubjectNo: string;

   role: string;

   contractNo: string;

   contractType: number;

   contractPhase: string;

   contractStatus: string;

   currency: string;

   originalCurrency: string;

   contractStartDate: string | null;

   contractRequestDate: string | null;

   contractEndPlannedDate: string | null;

   contractEndActualDate: string | null;

   lastPaymentDate: string | null;

   financedAmount: string;

   installmentsNumber: number;

   transactionType: string;

   paymentPeriodicity: string;

   paymentMethod: string;

   monthlyPaymentAmount: string;

   firstPaymentDate: string | null;

   lastPaymentAmount: string;

   nextPaymentDate: string | null;

   nextPaymentAmount: string;

   outstandingPaymentNumber: number | null;

   outstandingBalance: string;

   overduePaymentNumber: number | null;

   overduePaymentAmount: string | null;

   client: ClientLoanClient;

}

export interface ClientLoanClient {

   id: string;

   providerSubjectNo: string;

   firstName: string;

   middleName: string;

   lastName: string;

   suffix: string | null;

   genderCode: string | null;

   birthDate: string | null;

   civilStatusCode: number | null;

   address: string | null;

   address2: string | null;

   identificationTypeCode: number | null;

   identificationNumber: string | null;
   
   contactValue: string | null;

}

export interface ClientLoanPaginationResponse {

   success: boolean;

   data: ClientLoan[];

   pagination: {

      page: number;

      limit: number;

      total: number;

      totalPages: number;

   };
   summary:{
      activeLoans: number;
      pastDueLoans: number;
      totalLoanAmount: number;
      totalLoans: number;

   }

}


export type UploadDailyClientResponse = {
   message: string;
   batchId: string;
   totalRecords: number;
   totalClients: number;
   completedRecords: number;
   errorRecords: number;
   previewClients: unknown[];
 };


 export type ContractExportValidationError = {
  id: string;
  accountNo: string;
  providerSubjectNo: string;
  error: string;
};

export type ExportValidationResponse = {
  success: false;
  message: string;
  totalErrors: number;
  validationErrors: ContractExportValidationError[];
};


