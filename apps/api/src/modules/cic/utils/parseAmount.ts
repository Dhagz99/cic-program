export const parseAmount = (
   value: any
) => {

   if (!value) {
      return 0;
   }

   return Number(value);
};