import { parseDate } from "./parseDate";

export const parseMonthStartDate = (
   value: unknown
): Date | null => {
   const date = parseDate(value);

   if (!date) {
      return null;
   }

   return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
   );
};