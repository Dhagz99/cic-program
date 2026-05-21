import { DbfTypes } from "@repo/shared";
import { parseAmount }
   from "../utils/parseAmount";

import { parseDate }
   from "../utils/parseDate";
import { addTermToDate } from "../utils/addTermToDate";

export const normalizeContract = (
   row: DbfTypes
) => {



   return {


      providerSubjectNo:
      String(row.ID),

      contractNo:
         row.ACCTNO
            ? String(row.ACCTNO).trim()
            : null,
      
      contractStartDate:
         parseDate(
            row.AVAIL
         ),

      contractRequestDate:
         parseDate(
            row.AVAIL
         ),

      contractEndPlannedDate:
         addTermToDate(
            row.EFF,
            Number(row.FATERM), 
         ),

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
      lastPaymentAmount:
         parseAmount(
            row.MPA
         ),
      nextPaymentDate:
         row.LPDATE ?
         addTermToDate(
               row.LPDATE, 1
            ) : 
            addTermToDate(
               row.EFF, 1
            ),  
      nextPaymentAmount:
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
         row.BRANCH
   };

};