// utils/date/getLastDayOfMonth.ts

export const getLastDayOfMonth = (
    month: number,
    year: number
 ): string => {
 
    const lastDay =
       new Date(
          year,
          month,
          0
       );
 
    const day =
       String(
          lastDay.getDate()
       ).padStart(2, "0");
 
    const formattedMonth =
       String(
          lastDay.getMonth() + 1
       ).padStart(2, "0");
 
    const formattedYear =
       lastDay.getFullYear();
 
    return `${day}${formattedMonth}${formattedYear}`;
 };