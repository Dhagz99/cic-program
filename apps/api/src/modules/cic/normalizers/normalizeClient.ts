import { parseDate } from "../utils/parseDate";
import { parseFullName } from "../utils/parseFullName";
import { decodeDbfText } from "../utils/decodeDbfText";
import { DbfTypes } from "@repo/shared";
import { normalizeAddressText } from "../utils/address/normalizeAddressText";

export const normalizeClient = (
   row: DbfTypes,
   resolvedAddress: any
): any => {
   const decodedName =
      decodeDbfText(row.NAME);

   const decodedAdd1 =
      decodeDbfText(row.ADD1);

   const decodedAdd2 =
      decodeDbfText(row.ADD2);

   const decodedBranch =
      decodeDbfText(row.BRANCH);

   const decodedBank =
      decodeDbfText(row.BANK);

   const parsedName =
      parseFullName(decodedName);

   const isResolved =
      resolvedAddress?.validationStatus === "COMPLETE";

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
         parseDate(row.BIRTH),

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
            normalizeAddressText(decodedAdd1),
            normalizeAddressText(decodedAdd2),
            "PH",
            isResolved
               ? resolvedAddress.zipCode
               : "6004"
         ]
            .filter(Boolean)
            .join(", "),

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
            : 10
   };
};