export const calculateLastPaymentAmount = (
   previousBalance: number | null,
   currentBalance: number | null,
   fallbackPayment: number | null
): number | null => {

   // Existing contract with previous snapshot
   if (
      previousBalance !== null &&
      currentBalance !== null
   ) {
      const payment =
         previousBalance - currentBalance;

      return payment > 0
         ? payment
         : null;
   }

   // First upload / no previous snapshot
   // New contracts have MPA = 0
   if (
      fallbackPayment !== null &&
      fallbackPayment > 0
   ) {
      return fallbackPayment;
   }

   return null;
};