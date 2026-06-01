// utils/removeSpecialCharacters.ts

export const removeSpecialCharacters = (
    value?: string | null
 ): string => {
 
    if (!value) {
       return "";
    }
 
    return value.replace(
       /[^a-zA-Z0-9]/g,
       ""
    );
 
 };