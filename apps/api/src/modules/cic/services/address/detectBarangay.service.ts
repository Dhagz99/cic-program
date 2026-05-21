import prisma
from "../../../../lib/prisma";

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
      REMOVE MUNICIPALITY/PROVINCE
      --------------------------------
      */

      const cleanedAddress =
         normalizedAddress

            .replace(
               new RegExp(
                  municipality,
                  "gi"
               ),
               ""
            )

            .replace(
               /SIQUIJOR/gi,
               ""
            )

            .replace(/\s+/g, " ")

            .trim();

      /*
      --------------------------------
      FUSE SEARCH
      --------------------------------
      */

      const fuse =
         new Fuse(barangays, {

            keys: [
               "barangayName"
            ],

            threshold: 0.3,

            includeScore: true,

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

      /*
      --------------------------------
      CONFIDENCE
      --------------------------------
      */

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