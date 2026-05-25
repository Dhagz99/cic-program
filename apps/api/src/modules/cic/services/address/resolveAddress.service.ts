import { detectProvince }
from "./detectProvince.service";

import { detectMunicipality }
from "./detectMunicipality.service";

import { detectBarangay }
from "./detectBarangay.service";

import { normalizeAddress }
from "../../utils/address/normalizeClientAddress";

export const resolveAddress =
   async (
      rawAddress?: string | null
   ) => {

      /*
      --------------------------------
      NORMALIZE
      --------------------------------
      */

      const normalizedAddress =
         normalizeAddress(
            rawAddress
         );

      /*
      --------------------------------
      DETECT PROVINCE FIRST
      --------------------------------
      */

      const province =
         await detectProvince(
            normalizedAddress
         );

      /*
      --------------------------------
      DETECT MUNICIPALITY
      --------------------------------
      */

      const municipalityMatch =
         await detectMunicipality(

            normalizedAddress,

            province

         );

      if (!municipalityMatch) {

         return {

            normalizedAddress,

            province,

            municipality: null,

            barangay: null,

            zipCode: null,

            confidence: 0,

            validationStatus:
               "WITH_ERRORS",

         };

      }

      /*
      --------------------------------
      DETECT BARANGAY
      --------------------------------
      */

      const barangayMatch =
         await detectBarangay(

            normalizedAddress,

            municipalityMatch.municipality

         );

      /*
      --------------------------------
      BARANGAY NOT FOUND
      --------------------------------
      */

      if (!barangayMatch) {

         return {

            normalizedAddress,

            province:
               municipalityMatch.province,

            municipality:
               municipalityMatch.municipality,

            barangay: null,

            zipCode: null,

            confidence:
               municipalityMatch.confidence,

            validationStatus:
               "WITH_ERRORS",

         };

      }

      /*
      --------------------------------
      SUCCESS
      --------------------------------
      */

      return {

         normalizedAddress,

         province:
            barangayMatch.province,

         municipality:
            municipalityMatch.municipality,

         barangay:
            barangayMatch.barangay,

         zipCode:
            barangayMatch.zipCode,

         confidence:
            barangayMatch.confidence,

         validationStatus:
            barangayMatch.confidence >= 0.80
               ? "COMPLETE"
               : "WITH_ERRORS",

      };

   };