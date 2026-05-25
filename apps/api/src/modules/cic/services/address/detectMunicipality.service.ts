import prisma
from "../../../../lib/prisma";

export const detectMunicipality =
   async (

      normalizedAddress: string,

      province?: string | null

   ) => {

      /*
      --------------------------------
      GET MUNICIPALITIES
      --------------------------------
      */

      const municipalities =
         await prisma.pSGCReference.findMany({

            where:
               province
               ? {
                    provinceName: province
                 }
               : undefined,

            distinct: [
               "municipalityName"
            ],

            select: {

               municipalityName: true,

               provinceName: true,

            },

         });

      /*
      --------------------------------
      SORT LONGEST FIRST
      --------------------------------
      */

      municipalities.sort(
         (a, b) =>
            b.municipalityName.length -
            a.municipalityName.length
      );

      /*
      --------------------------------
      EXACT MATCH FIRST
      --------------------------------
      */

      for (const item of municipalities) {

         const municipality =
            item.municipalityName
               .toUpperCase();

         if (
            normalizedAddress.includes(
               municipality
            )
         ) {

            return {

               municipality:
                  item.municipalityName,

               province:
                  item.provinceName,

               confidence: 1,

            };

         }

      }

      return null;

   };