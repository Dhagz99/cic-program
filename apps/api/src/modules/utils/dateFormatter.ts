export function formatShortDate(date: Date | string) {
    return new Date(date).toLocaleDateString(
       "en-US",
       {
          month: "short",
          day: "numeric",
          year: "numeric",
       }
    );
 }
 
 export function formatReportingPeriod(
    month: number,
    year: number
 ) {
    const monthName = new Date(
       year,
       month - 1
    ).toLocaleString("en-US", {
       month: "long",
    });
 
    return `${monthName} ${year}`;
 }