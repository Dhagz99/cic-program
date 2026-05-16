// utils/date/addTermToDate.ts

export const addTermToDate = (
    startDate?: Date | string | null,
    termMonths?: number | null,
    subtractOneDay: boolean = false
 ): Date | null => {
 
    /*
    --------------------------------
    VALIDATE
    --------------------------------
    */
 
    if (
       !startDate ||
       termMonths === null ||
       termMonths === undefined
    ) {
       return null;
    }
 
    const date =
       new Date(startDate);
 
    /*
    --------------------------------
    INVALID DATE
    --------------------------------
    */
 
    if (isNaN(date.getTime())) {
       return null;
    }
 
    const result =
       new Date(date);
 
    result.setMonth(
       result.getMonth() + Number(termMonths)
    );
 
    /*
    --------------------------------
    OPTIONAL -1 DAY
    --------------------------------
    */
 
    if (subtractOneDay) {
       result.setDate(
          result.getDate() - 1
       );
    }
 
    return result;
 };