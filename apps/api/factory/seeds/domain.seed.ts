

import prisma from "../../src/lib/prisma";

export default async function seedDomains() {

   /* =========================
      GENDER DOMAIN
   ========================= */

   await prisma.genderDomain.createMany({

      data: [

         {
            code: "M",
            description: "Male"
         },

         {
            code: "F",
            description: "Female"
         }

      ],

      skipDuplicates: true

   });

   /* =========================
      CIVIL STATUS DOMAIN
   ========================= */

   await prisma.civilStatusDomain.createMany({

      data: [

         {
            code: 1,
            description: "Single"
         },

         {
            code: 2,
            description: "Married"
         },

         {
            code: 3,
            description: "Divorced/Separated"
         },

         {
            code: 4,
            description: "Widow"
         }

      ],

      skipDuplicates: true

   });

   /* =========================
      IDENTIFICATION TYPE DOMAIN
   ========================= */

   await prisma.identificationTypeDomain.createMany({

      data: [

         {
            code: 10,
            description: "TIN"
         },

         {
            code: 11,
            description: "SSS Card"
         },

         {
            code: 12,
            description: "GSIS"
         },

         {
            code: 13,
            description: "Philhealth Card"
         },

         {
            code: 14,
            description: "Senior Citizen card"
         },

         {
            code: 15,
            description: "UMID"
         },

         {
            code: 16,
            description:
               "SEC registration number"
         },

         {
            code: 17,
            description:
               "DTI registration number"
         },

         {
            code: 18,
            description:
               "CDA registration number"
         },

         {
            code: 19,
            description:
               "CooperativeId"
         }

      ],

      skipDuplicates: true

   });

   /* =========================
      OCCUPATION STATUS DOMAIN
   ========================= */

//    await prisma.occupationStatusDomain.createMany({

//       data: [

//          {
//             code: 1,
//             description:
//                "Permanent Job (Private sector)"
//          },

//          {
//             code: 2,
//             description:
//                "Temporary Job (Private sector)"
//          },

//          {
//             code: 3,
//             description:
//                "Permanent Job (Government sector)"
//          },

//          {
//             code: 4,
//             description:
//                "Temporary Job (Government sector)"
//          },

//          {
//             code: 5,
//             description:
//                "Self Employed"
//          },

//          {
//             code: 6,
//             description:
//                "Not Employed"
//          },

//          {
//             code: 7,
//             description:
//                "Retired"
//          },

//          {
//             code: 8,
//             description:
//                "Student"
//          },

//          {
//             code: 9,
//             description:
//                "Other"
//          }

//       ],

//       skipDuplicates: true

//    });

   console.log(
      "Domain tables seeded successfully"
   );

}