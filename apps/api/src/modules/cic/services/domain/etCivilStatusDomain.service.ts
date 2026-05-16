// services/domain/getCivilStatusDomain.service.ts

import prisma from "../../../../lib/prisma";

export const getCivilStatusDomainService =
async () => {

   return prisma.civilStatusDomain.findMany({

      orderBy: {
         code: "asc"
      }

   });

};