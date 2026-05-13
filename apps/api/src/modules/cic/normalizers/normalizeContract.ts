import { parseAmount }
   from "../utils/parseAmount";

import { parseDate }
   from "../utils/parseDate";

export const normalizeContract = (
   row: any
) => {

   return {

      contractNo:
         `${row.ID}-${row.BRANCH}`,

      financedAmount:
         parseAmount(
            row.BALAMT
         ),

      principalAmount:
         parseAmount(
            row.PRINCIPAL
         ),

      totalAmount:
         parseAmount(
            row.TOT
         ),

      newTotalAmount:
         parseAmount(
            row.NTOTAL
         ),

      balanceTerm:
         row.BALTERM,

      loanTerm:
         row.LRTERM,

      totalTerm:
         row.TOTERM,

      principalTerm:
         row.PTERM,

      contractStatus:
         row.PTYPE,

      loanType:
         row.LTYPE,

      grouping:
         row.GROUPING,

      availDate:
         parseDate(
            row.AVAIL
         ),

      lastPaymentDate:
         parseDate(
            row.LPDATE
         ),

      effectivityDate:
         parseDate(
            row.EFF
         ),

      inDate:
         parseDate(
            row.INDATE
         ),

      monthlyPaymentAmount:
         parseAmount(
            row.MPA
         ),

      lastPaymentAmount:
         parseAmount(
            row.LPAMT
         ),

      branch:
         row.BRANCH
   };

};