import { parseDate }
from "../utils/parseDate";

import { parseFullName }
from "../utils/parseFullName";

import { decodeDbfText }
from "../utils/decodeDbfText";
import { DbfTypes } from "@repo/shared";
import { resolveAddress } from "../services/address/resolveAddress.service";

export const normalizeClient = async (
   row: DbfTypes
): Promise<any> => {
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
  const rawAddress =
   [
      decodedAdd1?.trim(),
      decodedAdd2?.trim()
   ]
      .filter(Boolean)
      .join(", ");


      const resolvedAddress =
      await resolveAddress(
         rawAddress
      );

      const isResolved =
   resolvedAddress.validationStatus === "COMPLETE";


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

      addressPostalCode:
         isResolved
            ? resolvedAddress.zipCode
            : null,
      
      addressBarangay:
         isResolved
            ? resolvedAddress.barangay
            : null,
      
      addressCity:
         isResolved
            ? resolvedAddress.municipality
            : null,
      
      addressProvince:
         isResolved
            ? resolvedAddress.province
            : null,
      
    

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
            : 10,

   };

};