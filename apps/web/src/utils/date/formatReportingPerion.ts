export const formatReportingPeriod = (
    month: number,
    year: number
 ) => {
 
    return new Date(
 
       year,
       month - 1
 
    ).toLocaleString(
 
       "en-US",
 
       {
 
          month: "long"
 
       }
 
    ) + ` ${year}`;
 
 };