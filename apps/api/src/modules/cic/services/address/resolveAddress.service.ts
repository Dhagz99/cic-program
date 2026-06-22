import {
   PSGCReferenceCache
} from "./addressReferenceCache.service";

import {
   normalizeAddress
} from "../../utils/address/normalizeClientAddress";

const normalizeText = (
   value?: string | null
) => {
   return String(value ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
};

const findMatchedName = (
   searchableAddress: string,
   names: string[]
) => {
   return names.find((name) =>
      searchableAddress.includes(name)
   );
};

export const resolveAddressFromPSGCCache = (
   rawAddress: string | null | undefined,
   cache: PSGCReferenceCache
) => {
   const normalizedAddress =
      normalizeAddress(rawAddress);

   const searchableAddress =
      normalizeText(normalizedAddress);

   if (!searchableAddress) {
      return {
         normalizedAddress,
         province: null,
         municipality: null,
         barangay: null,
         zipCode: null,
         confidence: 0,
         validationStatus: "WITH_ERRORS"
      };
   }

   const matchedProvinceName =
      findMatchedName(
         searchableAddress,
         cache.provinceNames
      );

   const matchedMunicipalityName =
      findMatchedName(
         searchableAddress,
         cache.municipalityNames
      );

   const matchedBarangayName =
      findMatchedName(
         searchableAddress,
         cache.barangayNames
      );

   if (
      matchedBarangayName &&
      matchedMunicipalityName
   ) {
      const matchedRecord =
         cache.byBarangayMunicipality.get(
            `${matchedBarangayName}|${matchedMunicipalityName}`
         );

      if (matchedRecord) {
         return {
            normalizedAddress,

            province:
               matchedRecord.provinceName,

            municipality:
               matchedRecord.municipalityName,

            barangay:
               matchedRecord.barangayName,

            zipCode:
               matchedRecord.zipCode,

            confidence:
               1,

            validationStatus:
               "COMPLETE"
         };
      }
   }

   if (
      matchedMunicipalityName &&
      matchedProvinceName
   ) {
      const matchedRecord =
         cache.byMunicipalityProvince.get(
            `${matchedMunicipalityName}|${matchedProvinceName}`
         );

      if (matchedRecord) {
         return {
            normalizedAddress,

            province:
               matchedRecord.provinceName,

            municipality:
               matchedRecord.municipalityName,

            barangay:
               null,

            zipCode:
               null,

            confidence:
               0.6,

            validationStatus:
               "WITH_ERRORS"
         };
      }
   }

   if (matchedProvinceName) {
      const matchedRecord =
         cache.byProvince.get(
            matchedProvinceName
         );

      return {
         normalizedAddress,

         province:
            matchedRecord?.provinceName ?? matchedProvinceName,

         municipality:
            null,

         barangay:
            null,

         zipCode:
            null,

         confidence:
            0.3,

         validationStatus:
            "WITH_ERRORS"
      };
   }

   return {
      normalizedAddress,
      province: null,
      municipality: null,
      barangay: null,
      zipCode: null,
      confidence: 0,
      validationStatus: "WITH_ERRORS"
   };
};