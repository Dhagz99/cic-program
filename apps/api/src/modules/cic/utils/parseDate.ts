export const parseDate = (
   value: any
) => {

   if (!value) {
      return null;
   }

   const date =
      new Date(value);

   if (isNaN(date.getTime())) {
      return null;
   }

   return date;
};