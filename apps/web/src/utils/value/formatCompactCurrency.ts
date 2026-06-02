// utils/formatCompactCurrency.ts

export const formatCompactCurrency = (
    value?: number | string | null
 ): string => {
 
    const amount =
       Number(value ?? 0);
 
    if (amount >= 1_000_000_000) {
 
       return `₱${(
          amount / 1_000_000_000
       ).toFixed(1)}B`;
 
    }
 
    if (amount >= 1_000_000) {
 
       return `₱${(
          amount / 1_000_000
       ).toFixed(1)}M`;
 
    }
 
    if (amount >= 1_000) {
 
       return `₱${(
          amount / 1_000
       ).toFixed(1)}K`;
 
    }
 
    return `₱${amount.toLocaleString()}`;
 
 };