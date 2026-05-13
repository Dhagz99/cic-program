import { parseDate }
   from "../utils/parseDate";

export const normalizeClient = (
   row: any
) => {

   return {

      providerSubjectNo:
         String(row.ID),

      fullName:
         row.NAME?.trim(),

      birthDate:
         parseDate(
            row.BIRTH
         ),

      address1:
         row.ADD1?.trim(),

      address2:
         row.ADD2?.trim(),

      address:
         `${row.ADD1 || ""}
          ${row.ADD2 || ""}`.trim(),

      branch:
         row.BRANCH?.trim(),

      bank:
         row.BANK?.trim(),

      pensionAmount:
         row.PENSION,

      pensionType:
         row.PTYPE,

      sssNo:
         row.SSSNO,

      sss:
         row.SSS,

      gsis:
         row.GSIS,

      grouping:
         row.GROUPING
   };

};