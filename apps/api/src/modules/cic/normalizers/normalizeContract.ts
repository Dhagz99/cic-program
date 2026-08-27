import { DbfTypes } from "@repo/shared";
import { parseAmount }
   from "../utils/parseAmount";

import { parseDate }
   from "../utils/parseDate";
import { addTermToDate } from "../utils/addTermToDate";
import { parseMonthStartDate } from "../utils/parseMonthStartDate";
import { calculateLastPaymentAmount } from "../utils/calculateLastPaymentAmount";

export const normalizeContract = (
   row: DbfTypes,
   previousOutstandingBalance:
      number | null = null,
) => {

   

const contractStartDate =
   parseMonthStartDate(row.EFF);

   const outstandingBalance =
      parseAmount(
         row.TOT
      );



const lastPaymentAmount =
   calculateLastPaymentAmount(
      previousOutstandingBalance,
      outstandingBalance,
      parseAmount(row.LPAMT)
   );

   console.log({
   contractNo:
      row.ACCTNO,

   previousOutstandingBalance,

   currentOutstandingBalance:
      outstandingBalance,

   fallbackPayment:
      parseAmount(row.LPAMT),

   calculatedLastPayment:
      lastPaymentAmount,
});



   return {


      providerSubjectNo:
      String(row.ID),

      contractNo:
         row.ACCTNO
            ? String(row.ACCTNO).trim()
            : null,
      
      contractStartDate,
      
      contractRequestDate:
         parseDate(
            row.AVAIL
         ),

     contractEndPlannedDate:
      contractStartDate
         ? new Date(
              contractStartDate.getFullYear(),
              contractStartDate.getMonth() +
                 Number(row.FATERM),
              0
           )
         : null,

      contractEndActualDate:
         row.CPD === "CL" 
               ?
            parseDate(row.LPDATE) :
            null,

      lastPaymentDate:
         parseDate(
            row.LPDATE
         ),

      financedAmount:
         parseAmount(
            row.FAMT
         ),

      installmentsNumber:
         parseAmount(
            row.FATERM
         ),

      monthlyPaymentAmount:
         (row.MPA != 0) ?
         parseAmount(
            row.MPA
         ) :
          parseAmount(
            row.PENSION
         ) ,


      firstPaymentDate:
         parseDate(
            row.EFF
         ),

      lastPaymentAmount,

      nextPaymentDate:
         row.CPD == "CL" ? null 
              :
         row.LPDATE ?
         addTermToDate(
               row.LPDATE, 1
            ) : 
            addTermToDate(
               row.EFF, 1
            ),  




      nextPaymentAmount:

        row.CPD == "CL" ? 0  
            :
         (row.MPA != 0) ?
         parseAmount(
            row.MPA
         ) :
         parseAmount(
            row.PENSION
         ) ,


      outstandingPaymentNumber:
         parseAmount(
            row.TOTERM
         ),

      outstandingBalance:
         parseAmount(
            row.TOT
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

     

      effectivityDate:
         parseDate(
            row.EFF
         ),

      inDate:
         parseDate(
            row.INDATE
         ),

  
      branch:
         row.BRANCH,

      contractPhase:
         row.CPD
   };

};