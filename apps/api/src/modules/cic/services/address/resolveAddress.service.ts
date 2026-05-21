

import { detectBarangay }
from "./detectBarangay.service";

import { normalizeAddress }
from "../../utils/address/normalizeClientAddress";
import { detectMunicipality } from "./detectMunicipality.service";

export const resolveAddress =
   async (
      rawAddress?: string | null
   ) => {

      /*
      --------------------------------
      NORMALIZE ADDRESS
      --------------------------------
      */

      const normalizedAddress =
         normalizeAddress(
            rawAddress
         );

      /*
      --------------------------------
      DETECT MUNICIPALITY
      --------------------------------
      */

      const municipalityMatch =
         await detectMunicipality(
            normalizedAddress
         );

      /*
      --------------------------------
      MUNICIPALITY NOT FOUND
      --------------------------------
      */

      if (!municipalityMatch) {

         return {

            normalizedAddress,

            province: null,

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

            zipCode:
               municipalityMatch.zipCode,

            confidence: 0.40,

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