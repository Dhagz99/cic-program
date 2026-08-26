import { parseDate } from "./parseDate";

export const parseMonthEndDate = (
   value: unknown
): Date | null => {
   const date = parseDate(value);

   if (!date) {
      return null;
   }

   return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
   );
};