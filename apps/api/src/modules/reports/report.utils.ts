export const getOverDueDaysDomain = (
   installmentsNumber: number | null,
   financedAmount: number | null,
   outstandingPaymentNumber: number | null,
   outstandingBalance: number | null,
): string => {
   const isTooNewToRate =
      installmentsNumber === outstandingPaymentNumber &&
      financedAmount === outstandingBalance;

   if (isTooNewToRate) {
      return "N";
   }

   return "0";
};