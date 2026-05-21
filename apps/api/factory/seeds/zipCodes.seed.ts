import fs from "fs";

import path from "path";

import readline from "readline";
import prisma from "../../src/lib/prisma";


async function seedZipCodes() {

   const filePath =
      path.join(
         process.cwd(),
         "factory/seeds",
         "PH.txt"
      );

   const fileStream =
      fs.createReadStream(filePath);

   const rl =
      readline.createInterface({

         input:
            fileStream,

         crlfDelay:
            Infinity,

      });

   /*
   -----------------------------------
   COLLECT UNIQUE UPDATES
   -----------------------------------
   */

   const updates = new Map();

   for await (const line of rl) {

      const columns =
         line.split("\t");

      const zipCode =
         columns[1]
            ?.trim();

      const municipalityName =
         columns[2]
            ?.trim();

      const provinceRaw =
         columns[5]
            ?.trim();

      const provinceName =
         provinceRaw
            ?.replace(
               /^Province of\s+/i,
               ""
            )
            .trim();

      if (

         !zipCode ||

         !municipalityName ||

         !provinceName

      ) {

         continue;

      }

      /*
      -----------------------------------
      UNIQUE KEY
      -----------------------------------
      */

      const key =
         `${provinceName}-${municipalityName}`;

      if (
         !updates.has(key)
      ) {

         updates.set(
            key,
            {
               provinceName,
               municipalityName,
               zipCode,
            }
         );

      }

   }

   console.log(
      `Prepared ${updates.size} ZIP updates`
   );

   /*
   -----------------------------------
   EXECUTE UPDATES
   -----------------------------------
   */

   let successCount = 0;

   for (const update of updates.values()) {

      try {

         const result =
            await prisma.pSGCReference.updateMany({

               where: {

                  provinceName: {

                     contains:
                        update.provinceName,

                     mode:
                        "insensitive",

                  },

                  municipalityName: {

                     contains:
                        update.municipalityName,

                     mode:
                        "insensitive",

                  },

               },

               data: {

                  zipCode:
                     update.zipCode,

               },

            });

         if (
            result.count > 0
         ) {

            successCount++;

            console.log(

               `Updated ${update.municipalityName} -> ${update.zipCode}`

            );

         }

      }

      catch (error) {

         console.error(

            `Failed: ${update.municipalityName}`,

            error

         );

      }

   }

   console.log(
      `ZIP Import Complete (${successCount} updated)`
   );

   await prisma.$disconnect();

}

seedZipCodes()
   .catch(async error => {

      console.error(error);

      await prisma.$disconnect();

      process.exit(1);

   });