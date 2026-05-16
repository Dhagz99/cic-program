// services/domain/getGenderDomain.service.ts

import prisma from "../../../../lib/prisma";

export const getGenderDomainService =
async () => {

   return prisma.genderDomain.findMany({

      orderBy: {
         description: "asc"
      }

   });

};