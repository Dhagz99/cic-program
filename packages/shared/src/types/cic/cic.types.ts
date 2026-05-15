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
    
    placeOfBirth: string | null;
 
    gender: string | null;
 
    civilStatus: string | null;

    numberOfDependents: number;
 
   birthDate: string

    addressType: string;
    address: string;
    addressType2: string;
    address2: string;

    identificationType: string;
    identificationNumber: string;

    contactType: string | null;
    contactValue: string | null;

 
    validationStatus: string;
 
    validationErrors: ValidationError[];
 
    stagingContracts: StagingContract[];
 
 }