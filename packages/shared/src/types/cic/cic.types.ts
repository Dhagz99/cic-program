
export interface DomainOption<T = string | number> {

   code: T;

   description: string;

}

export interface ValidationError {

    id: string;
 
    fieldName: string;
  
    errorMessage: string;
 
 }
 
 export interface StagingContract {
 
    id: string;
 
    contractNo: string;

    contractType?: number;
 
    contractPhase?: string;
 
    contractStatus?: string;
 
    currency?: string;
 
    originalCurrency?: string;
 
    contractStartDate?: string;
 
    contractRequestDate?: string;
 
    contractEndPlannedDate?: string;
 
    contractEndActualDate?: string;
 
    lastPaymentDate?: string;
 
    financedAmount?: number;
 
    installmentsNumber?: number;
 
    transactionType?: string;
 
    paymentPeriodicity?: string;
 
    paymentMethod?: string;
 
    monthlyPaymentAmount?: number;
 
    firstPaymentDate?: string;
 
    lastPaymentAmount?: number;
 
    nextPaymentDate?: string;
 
    nextPaymentAmount?: number;
 
    outstandingPaymentNumber?: number;
 
    outstandingBalance?: number;
 
    overduePaymentNumber?: number;
 
    overduePaymentAmount?: number;
 
    validationStatus: string;
 
    validationErrors: ValidationError[];
 
 }
 
 export interface StagingClient {
 
    id: string;

    providerSubjectNo: string
 
    fullName: string;
 
    firstName: string;
 
    middleName: string;
 
    lastName: string;

    suffix: string | null;
    
    placeOfBirth: string | null;
 
    gender: DomainOption<string> | null;
 
    civilStatus: DomainOption<number> | null;
    branch: {
      branchCode: string      
      branchName: string
    }

    numberOfDependents: number;
 
   birthDate: string

    addressType: string;
    address: string;
    addressType2: string;
    address2: string;

    identificationType:
      DomainOption<number> | null;
    identificationNumber: string;

    contactType: string | null;
    contactValue: string | null;

 
    validationStatus: string;
 
    validationErrors: ValidationError[];
 
    stagingContracts: StagingContract[];
 
 }


// types/cic/loan.ts

export type UpdateLoanFormValues= {

   contractNo: string;

   contractType?: number;

   contractPhase?: string;

   contractStatus?: string;

   currency?: string;

   originalCurrency?: string;

   contractStartDate?: string;

   contractRequestDate?: string;

   contractEndPlannedDate?: string;

   contractEndActualDate?: string;

   lastPaymentDate?: string;

   financedAmount?: number;

   installmentsNumber?: number;

   transactionType?: string;

   paymentPeriodicity?: string;

   paymentMethod?: string;

   monthlyPaymentAmount?: number;

   firstPaymentDate?: string;

   lastPaymentAmount?: number;

   nextPaymentDate?: string;

   nextPaymentAmount?: number;

   outstandingPaymentNumber?: number;

   outstandingBalance?: number;

   overduePaymentNumber?: number;

   overduePaymentAmount?: number;

};