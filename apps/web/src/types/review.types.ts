import { StagingClient, StagingContract, ValidationError } from "@repo/shared";

 
 export type ReviewClient = {
 
    stagingClient:
       StagingClient & {
 
          stagingContracts:
             StagingContract[];
 
          validationErrors:
             ValidationError[];
 
       };
 
    existingClient:
       StagingClient | null;
 
    mergedPreview: {
 
       firstName: string;
 
       middleName: string;
 
       lastName: string;
 
       suffix: string;
 
       genderCode: string;
 
       address: string;
 
       address2: string;
 
       contactValue: string;

       civilStatusCode: string;

       identificationTypeCode: string;

 
    };
 
    comparison: {
 
       firstNameConflict: boolean;
 
       genderMissing: boolean;
 
       addressMissing: boolean;
 
    };

    effectiveValidationStatus: string;

        effectiveValidationErrors: {

        fieldName: string;

        errorMessage: string;

        }[];
 
 };