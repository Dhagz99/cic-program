// utils/formatNumber.ts

export const formatNumber = (
    value?: number | string | null
 ): string => {
 
    const numberValue =
       Number(value ?? 0);
 
    return numberValue.toLocaleString(
       "en-US"
    );
 
 };