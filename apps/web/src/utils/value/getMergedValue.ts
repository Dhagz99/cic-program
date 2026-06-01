// utils/getMergedValue.ts

export const getMergedValue = <T>(
    uploadedValue: T | null | undefined,
    existingValue: T | null | undefined,
    invalidValues: unknown[] = [
       null,
       undefined,
       "",
       0,
       "0",
       "10"
    ]
 ): T | null | undefined => {
 
    if (
       invalidValues.includes(uploadedValue)
    ) {
 
       return existingValue;
 
    }
 
    return uploadedValue;
 
 };