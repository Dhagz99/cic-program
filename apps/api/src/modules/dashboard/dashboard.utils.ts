
export const calculateGrowthPercentage = (
    current: number,
    previous: number
 ) => {
 
    if (previous === 0) {
 
       return 0;
 
    }
 
    return Number(
       (
          ((current - previous) / previous) * 100
       ).toFixed(1)
    );
 
 };