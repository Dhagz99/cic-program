import path from "path";

import * as XLSX from "xlsx";
import prisma from "../../src/lib/prisma";





export async function seedPSGC() {

   const filePath =
      path.join(
         process.cwd(),
         "factory/seeds",
         "psgc.xlsx"
      );

   /*
   -----------------------------------
   LOAD WORKBOOK
   -----------------------------------
   */

   const workbook =
      XLSX.readFile(filePath);

   /*
   -----------------------------------
   GET PSGC SHEET
   -----------------------------------
   */

   const worksheet =
      workbook.Sheets["PSGC"];

   if (!worksheet) {

      throw new Error(
         "PSGC sheet not found"
      );

   }

   /*
   -----------------------------------
   CONVERT TO JSON
   -----------------------------------
   */

   const rows: any[] =
      XLSX.utils.sheet_to_json(
         worksheet
      );

   console.log(
      `Found ${rows.length} rows`
   );

   /*
   -----------------------------------
   HIERARCHY TRACKERS
   -----------------------------------
   */

   let currentRegion:
      string | null = null;

   let currentProvince:
      string | null = null;

   let currentMunicipality:
      string | null = null;

   /*
   -----------------------------------
   FINAL DATA
   -----------------------------------
   */

   const data: any[] = [];

   /*
   -----------------------------------
   LOOP ROWS
   -----------------------------------
   */

   for (const row of rows) {

      const geographicLevel =
         row["Geographic Level"]
            ?.toString()
            .trim();

      const name =
         row["Name"]
            ?.toString()
            .trim();

      /*
      -----------------------------------
      REGION
      -----------------------------------
      */

      if (
         geographicLevel === "Reg"
      ) {

         currentRegion =
            name;

         currentProvince =
            null;

         currentMunicipality =
            null;

      }

      /*
      -----------------------------------
      PROVINCE
      -----------------------------------
      */

      else if (
         geographicLevel === "Prov"
      ) {

         currentProvince =
            name;

         currentMunicipality =
            null;

      }

      /*
      -----------------------------------
      CITY / MUNICIPALITY
      -----------------------------------
      */

      else if (

         geographicLevel === "City" ||

         geographicLevel === "Mun"

      ) {

         currentMunicipality =
            name;

      }

      /*
      -----------------------------------
      BARANGAY
      -----------------------------------
      */

      else if (
         geographicLevel === "Bgy"
      ) {

         /*
         -----------------------------------
         NCR SPECIAL CASE
         -----------------------------------
         */

         const provinceName =
            currentProvince ??
            currentMunicipality;

         /*
         -----------------------------------
         VALIDATION
         -----------------------------------
         */

         if (

            currentRegion &&
            currentMunicipality &&
            name

         ) {

            data.push({

               regionName:
                  currentRegion,

               provinceName,

               municipalityName:
                  currentMunicipality,

               barangayName:
                  name,

               zipCode:
                  null,

            });

         }

      }

   }

   console.log(
      `Prepared ${data.length} barangays`
   );

   /*
   -----------------------------------
   INSERT DATABASE
   -----------------------------------
   */

   await prisma.pSGCReference.createMany({

      data,

      skipDuplicates: true,

   });

   console.log(
      "PSGC Import Complete"
   );

   await prisma.$disconnect();

}

seedPSGC()
   .catch(async error => {

      console.error(error);

      await prisma.$disconnect();

      process.exit(1);

   });