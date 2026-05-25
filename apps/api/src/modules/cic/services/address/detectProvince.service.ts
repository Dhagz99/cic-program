import prisma
from "../../../../lib/prisma";

export const detectProvince =
   async (
      normalizedAddress: string
   ) => {

      const provinces =
         await prisma.pSGCReference.findMany({

            distinct: [
               "provinceName"
            ],

            select: {
               provinceName: true
            }

         });

      /*
      --------------------------------
      EXACT MATCH FIRST
      --------------------------------
      */

      const exactMatch =
         provinces.find(
            item =>
               normalizedAddress.includes(
                  item.provinceName
                     .toUpperCase()
               )
         );

      if (exactMatch) {

         return exactMatch.provinceName;

      }

      /*
      --------------------------------
      NEGROS SHORTCUTS
      --------------------------------
      */

      if (
         normalizedAddress.includes("NEG OR") ||
         normalizedAddress.includes("NEGROS ORIENTAL")
      ) {

         return "Negros Oriental";

      }

      if (
         normalizedAddress.includes("NEG OCC") ||
         normalizedAddress.includes("NEGROS OCCIDENTAL")
      ) {

         return "Negros Occidental";

      }

      return null;

   };