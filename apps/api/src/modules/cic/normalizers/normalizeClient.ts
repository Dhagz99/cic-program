import { parseDate }
from "../utils/parseDate";

import { parseFullName }
from "../utils/parseFullName";

import { decodeDbfText }
from "../utils/decodeDbfText";
import { DbfTypes } from "@repo/shared";

export const normalizeClient = (
   row: DbfTypes
) => {

   /*
   -----------------------------------
   DECODE TEXT FIELDS
   -----------------------------------
   */

   const decodedName =
      decodeDbfText(
         row.NAME
      );

   const decodedAdd1 =
      decodeDbfText(
         row.ADD1
      );

   const decodedAdd2 =
      decodeDbfText(
         row.ADD2
      );

   const decodedBranch =
      decodeDbfText(
         row.BRANCH
      );

   const decodedBank =
      decodeDbfText(
         row.BANK
      );

   /*
   -----------------------------------
   PARSE NAME
   -----------------------------------
   */

   const parsedName =
      parseFullName(
         decodedName
      );

   /*
   -----------------------------------
   RETURN NORMALIZED CLIENT
   -----------------------------------
   */

   return {

      providerSubjectNo:
         String(row.ID),

      fullName:
         decodedName,

      firstName:
         parsedName.firstName,

      middleName:
         parsedName.middleName,

      lastName:
         parsedName.lastName,

      suffix:
         parsedName.suffix,

      birthDate:
         parseDate(
            row.BIRTH
         ),

      address1:
         decodedAdd1,

      address2:
         decodedAdd2,

      address:
         [
            decodedAdd1?.trim(),
            decodedAdd2?.trim()
         ]
            .filter(Boolean)
            .join(" "),


      branch:
         decodedBranch,

      bank:
         decodedBank,

      pensionAmount:
         row.PENSION,
 
      pensionType:
         row.PTYPE,

      sssNo:
         row.SSSNO,

      grouping:
         row.GROUPING === "SSS"
            ? 11
            : row.GROUPING === "GSIS"
            ? 12
            : null,

   };

};