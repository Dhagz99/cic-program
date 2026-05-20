import { GetClientsParams } from "@repo/shared";
import prisma from "../../lib/prisma";

     
export async function getClientsService(
   branchId: string
) {
   try {
      const clients =
         await prisma.client.findMany({
            where: {
               branchId,
            },
            orderBy: {
               createdAt: "desc",
            },
         });

      return clients;

   } catch (error) {
      console.error(
         "Get Clients Service Error:",
         error
      );

      throw new Error(
         "Failed to fetch clients"
      );

   }
}



export async function getClientContractsService(
        branchId: string
     ) {
        try {
           const clients =
              await prisma.contract.findMany({
                 where: {
                    branchId,
                 },
                 orderBy: {
                    createdAt: "desc",
                 },
              });
     
           return clients;
     
        } catch (error) {
           console.error(
              "Get Contract Service Error:",
              error
           );
     
           throw new Error(
              "Failed to fetch contracts"
           );
     
        }
     }


     

     export async function getClientsPaginationService({
        branchId,
        page = 1,
        limit = 10,
        search = "",
        genderCode,
        civilStatusCode,
     }: GetClientsParams) {
     
        const skip =
           (page - 1) * limit;
     
        const whereCondition: any = {
           branchId,
     
           ...(genderCode && {
              genderCode,
           }),
     
           ...(civilStatusCode && {
              civilStatusCode,
           }),
     
           ...(search && {
              OR: [
                 {
                    firstName: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
                 {
                    middleName: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
                 {
                    lastName: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
                 {
                    providerSubjectNo: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
              ],
           }),
        };
     
        const [clients, total] =
           await Promise.all([
     
              prisma.client.findMany({
                 where: whereCondition,
                
     
                 skip,
     
                 take: limit,
                 orderBy: {
                    createdAt: "desc",
                 },
     
                 include: {
                    gender: true,
                    civilStatus: true,
                     branch: true,

                 },
              }),
     
              prisma.client.count({
                 where: whereCondition,
              }),
           ]);
     
        return {
           data: clients,
     
           pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(
                 total / limit
              ),
           },
        };
     }