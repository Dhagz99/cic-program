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

export const getExternalClientByAccountService = async (
   accountNo: string
) => {
   const client  = await prisma.client.findFirst({
      where: {
         providerSubjectNo: accountNo
      },
      select:{
         id: true,
         firstName: true,
         middleName: true,
         lastName: true,
         providerSubjectNo: true,
         address: true,
         contactValue: true,
         genderCode: true,
         identificationTypeCode: true,
         identificationNumber: true,
         birthDate: true,
         placeOfBirth: true,

      }
   });

   if(!client) {
      throw new Error("Client not found");
   }

   return {
      id: client,
      accountNo: client.providerSubjectNo,
      fullName: [
         client.firstName,
         client.middleName,
         client.lastName,
      ],
      address: client.address,
      contactNumber: client.contactValue,
      gender: client.genderCode,
      idType: client.identificationTypeCode,
      idNumber: client.identificationNumber,
      birthDate: client.birthDate,
      birthPlace: client.placeOfBirth
   }
}