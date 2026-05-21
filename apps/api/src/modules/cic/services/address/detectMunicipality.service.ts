import prisma
from "../../../../lib/prisma";

export const detectMunicipality =
   async (
      normalizedAddress: string
   ) => {

      /*
      --------------------------------
      GET UNIQUE MUNICIPALITIES
      --------------------------------
      */

      const municipalities =
         await prisma.pSGCReference.findMany({

            distinct: [
               "municipalityName"
            ],

            select: {

               municipalityName: true,

               provinceName: true,

               zipCode: true,

            },

         });

      /*
      --------------------------------
      TOKEN MATCH
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

               zipCode:
                  item.zipCode,

            };

         }

      }

      return null;

   };