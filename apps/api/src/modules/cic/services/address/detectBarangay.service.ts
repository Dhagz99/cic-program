import prisma
from "../../../../lib/prisma";
import { extractBarangayCandidate } from "./extractBarangayCanditate.service";



export const detectBarangay =
   async (

      normalizedAddress: string,

      municipality: string

   ) => {

      const Fuse =
         (
            await import("fuse.js")
         ).default;

      /*
      --------------------------------
      GET BARANGAYS
      --------------------------------
      */

      const barangays =
         await prisma.pSGCReference.findMany({

            where: {

               municipalityName: {

                  equals:
                     municipality,

                  mode:
                     "insensitive",

               },

            },

         });

      if (!barangays.length) {

         return null;

      }

      /*
      --------------------------------
      EXTRACT BARANGAY CANDIDATE
      --------------------------------
      */

      const candidate =
         extractBarangayCandidate(
            normalizedAddress
         );

      /*
      --------------------------------
      CLEAN ADDRESS
      --------------------------------
      */

      const cleanedAddress =
         (
            candidate ||
            normalizedAddress
         )

            .replace(
               new RegExp(
                  municipality,
                  "gi"
               ),
               ""
            )

            .replace(
               /CITY/gi,
               ""
            )

            .replace(
               /NEGROS ORIENTAL/gi,
               ""
            )

            .replace(
               /NEGROS OCCIDENTAL/gi,
               ""
            )

            .replace(
               /NEG OR/gi,
               ""
            )

            .replace(
               /NEG OCC/gi,
               ""
            )

            .replace(
               /BARANGAY/gi,
               ""
            )

            .replace(
               /BRGY/gi,
               ""
            )

            .replace(
               /BGY/gi,
               ""
            )

            .replace(
               /\bB\b/gi,
               ""
            )

            /*
            --------------------------------
            REMOVE ADDRESS NOISE
            --------------------------------
            */

            .replace(
               /\bPUROK\b/gi,
               ""
            )

            .replace(
               /\bPRK\b/gi,
               ""
            )

            .replace(
               /\bSITIO\b/gi,
               ""
            )

            .replace(
               /\bSO\b/gi,
               ""
            )

            .replace(
               /\bHDA\b/gi,
               ""
            )

            .replace(
               /\bSTREET\b/gi,
               ""
            )

            .replace(
               /\bST\b/gi,
               ""
            )

            .replace(
               /\bROAD\b/gi,
               ""
            )

            .replace(
               /\bRD\b/gi,
               ""
            )

            .replace(
               /\bPHASE\b/gi,
               ""
            )

            .replace(
               /\bLOT\b/gi,
               ""
            )

            .replace(
               /\bBLOCK\b/gi,
               ""
            )

            .replace(
               /\bBLK\b/gi,
               ""
            )

            .replace(
               /\bSUBD\b/gi,
               ""
            )

            .replace(
               /\bPROPER\b/gi,
               ""
            )

            .replace(
               /\bPOB\b/gi,
               ""
            )

            .replace(
               /\s+/g,
               " "
            )

            .trim();

      /*
      --------------------------------
      PREPARE SEARCH
      --------------------------------
      */

      const prepared =
         barangays.map(
            item => ({

               ...item,

               searchable:
                  item.barangayName
                     .toUpperCase()
                     .replace(/\s+/g, " ")
                     .trim(),

            })
         );

      /*
      --------------------------------
      EXACT MATCH FIRST
      --------------------------------
      */

      const exactMatch =
         prepared.find(
            item =>
               cleanedAddress.includes(
                  item.searchable
               )
         );

      if (exactMatch) {

         return {

            barangay:
               exactMatch.barangayName,

            province:
               exactMatch.provinceName,

            zipCode:
               exactMatch.zipCode,

            confidence: 1,

         };

      }

      /*
      --------------------------------
      FUSE SEARCH
      --------------------------------
      */

      const fuse =
         new Fuse(prepared, {

            keys: [
               "searchable"
            ],

            threshold: 0.30,

            includeScore: true,

            ignoreLocation: true,

            minMatchCharLength: 2,

         });

      /*
      --------------------------------
      SEARCH
      --------------------------------
      */

      const result =
         fuse.search(
            cleanedAddress
         );

      if (!result.length) {

         return null;

      }

      /*
      --------------------------------
      BEST MATCH
      --------------------------------
      */

      const bestMatch =
         result[0];

      const confidence =
         Number(
            (
               1 -
               (
                  bestMatch.score ?? 1
               )
            ).toFixed(2)
         );

      /*
      --------------------------------
      LOW CONFIDENCE
      --------------------------------
      */

      if (confidence < 0.50) {

         return null;

      }

      return {

         barangay:
            bestMatch.item.barangayName,

         province:
            bestMatch.item.provinceName,

         zipCode:
            bestMatch.item.zipCode,

         confidence,

      };

   };