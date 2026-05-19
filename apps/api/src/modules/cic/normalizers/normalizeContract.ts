import { DbfTypes } from "@repo/shared";
import { parseAmount }
   from "../utils/parseAmount";

import { parseDate }
   from "../utils/parseDate";
import { addTermToDate } from "../utils/addTermToDate";

export const normalizeContract = (
   row: DbfTypes
) => {

   const decodedContractEnd = row.EFF + row.FATERM;

   return {
      providerSubjectNo:
      String(row.ID),

      contractNo:
         `${row.ID}-${row.BRANCH}`,
      
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
         parseAmount(
            row.MPA
         ),

      firstPaymentDate:
         parseDate(
            row.EFF
         ),
      lastPaymentAmount:
         parseAmount(
            row.MPA
         ),
      nextPaymentDate:
         addTermToDate(
               row.LPDATE, 1
            ),  
      nextPaymentAmount:
         parseAmount(
            row.MPA
         ),

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