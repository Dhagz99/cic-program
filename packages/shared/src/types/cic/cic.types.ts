export interface ValidationError {

    id: string;
 
    fieldName: string;
 
    errorMessage: string;
 
 }
 
 export interface StagingContract {
 
    id: string;
 
    contractNo: string;
 
    contractStatus: string;
 
    financedAmount: string;
 
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
 
    gender: string | null;
 
    civilStatus: string | null;
 
    tinNumber: string | null;
 
    address: string;
 
    validationStatus: string;
 
    validationErrors: ValidationError[];
 
    stagingContracts: StagingContract[];
 
 }