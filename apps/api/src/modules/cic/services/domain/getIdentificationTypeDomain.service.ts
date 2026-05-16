// services/domain/getIdentificationTypeDomain.service.ts

import prisma from "../../../../lib/prisma";

export const getIdentificationTypeDomainService =
async () => {

   return prisma.identificationTypeDomain.findMany({

      orderBy: {
         code: "asc"
      }

   });

};