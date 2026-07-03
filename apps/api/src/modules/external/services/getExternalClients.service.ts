// src/modules/external/services/getExternalClients.service.ts

import prisma from "../../../lib/prisma";


export const getExternalClientsService = async ({
   search,
   page = 1,
   limit = 50,
}: {
   search?: string;
   page?: number;
   limit?: number;
}) => {
   const skip = (page - 1) * limit;

   const where: any = {};

   if (search) {
      where.OR = [
         { firstName: { contains: search, mode: "insensitive" } },
         { lastName: { contains: search, mode: "insensitive" } },
         { providerSubjectNo: { contains: search, mode: "insensitive" } },
      ];
   }

   const [clients, total] = await Promise.all([
      prisma.client.findMany({
         where,
         skip,
         take: limit,
         select: {
            id: true,
            providerSubjectNo: true,
            firstName: true,
            middleName: true,
            lastName: true,
            suffix: true,
            birthDate: true,
            gender: true,
            contactValue: true,
            address: true,
            createdAt: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      }),

      prisma.client.count({ where }),
   ]);

   return {
      data: clients,
      pagination: {
         page,
         limit,
         total,
         totalPages: Math.ceil(total / limit),
      },
   };
};