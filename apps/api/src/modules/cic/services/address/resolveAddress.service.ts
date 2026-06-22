import { PSGCReferenceCacheItem } from "./addressReferenceCache.service";
import { normalizeAddress } from "../../utils/address/normalizeClientAddress";

const normalizeText = (
   value?: string | null
) => {
   return String(value ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
};

export const resolveAddressFromPSGCCache = (
   rawAddress: string | null | undefined,
   psgcCache: PSGCReferenceCacheItem[]
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

   const matchedBarangay =
      psgcCache.find((item) => {
         if (!item.searchableBarangayName) {
            return false;
         }

         const hasBarangay =
            searchableAddress.includes(
               item.searchableBarangayName
            );

         const hasMunicipality =
            item.searchableMunicipalityName
               ? searchableAddress.includes(
                    item.searchableMunicipalityName
                 )
               : true;

         return hasBarangay && hasMunicipality;
      });

   if (matchedBarangay) {
      return {
         normalizedAddress,
         province: matchedBarangay.provinceName,
         municipality: matchedBarangay.municipalityName,
         barangay: matchedBarangay.barangayName,
         zipCode: matchedBarangay.zipCode,
         confidence: 1,
         validationStatus: "COMPLETE"
      };
   }

   const matchedMunicipality =
      psgcCache.find((item) => {
         if (!item.searchableMunicipalityName) {
            return false;
         }

         return searchableAddress.includes(
            item.searchableMunicipalityName
         );
      });

   if (matchedMunicipality) {
      return {
         normalizedAddress,
         province: matchedMunicipality.provinceName,
         municipality: matchedMunicipality.municipalityName,
         barangay: null,
         zipCode: null,
         confidence: 0.6,
         validationStatus: "WITH_ERRORS"
      };
   }

   const matchedProvince =
      psgcCache.find((item) => {
         if (!item.searchableProvinceName) {
            return false;
         }

         return searchableAddress.includes(
            item.searchableProvinceName
         );
      });

   return {
      normalizedAddress,
      province: matchedProvince?.provinceName ?? null,
      municipality: null,
      barangay: null,
      zipCode: null,
      confidence: matchedProvince ? 0.3 : 0,
      validationStatus: "WITH_ERRORS"
   };
};