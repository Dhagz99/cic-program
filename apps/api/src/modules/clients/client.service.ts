import { GetClientsParams, UpdateClientFormValues } from "@repo/shared";
import prisma from "../../lib/prisma";
import { AddressType } from "@prisma/client";

     
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
        isAdmin
     }: GetClientsParams) {

      const branchFilter =
      isAdmin
         ? {}
         : {
              branchId
           };
     
        const skip =
           (page - 1) * limit;
     
        const whereCondition: any = {
          ...branchFilter,
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
     
        const [
            clients, 
            total,
            totalContracts,
            financedSummary,
            outstandingSummary,
          ] =
           await Promise.all([
     
              prisma.client.findMany({
                 where: whereCondition,
                 skip,
                 take: limit,
                 orderBy: {
                    providerSubjectNo: "asc",
                 },
                 include: {
                    gender: true,
                    civilStatus: true,
                     branch: true,
                     identificationType: true,
                     secondaryidentificationType: true,
                     Contracts: {
                        orderBy:{
                           createdAt: "desc"
                        }
                     },

                 },
              }), 
     
              prisma.client.count({
                 where: branchFilter,
              }),

              prisma.contract.count({
                  where: {
                     client: branchFilter,
                  },
                }),

              prisma.contract.aggregate({
               where:{
                  client: branchFilter
               },
               _sum: {
                  financedAmount: true
               }
              }),
              
              prisma.contract.aggregate({
               where: {
                  client: branchFilter,
               },
               _sum: {
                  outstandingBalance: true,
               },
            }),

           ]);
     
        return {
           data: clients,

           summary: {
            totalBorrowers: total,
            totalContracts,
            totalFinancedAmount:
               financedSummary._sum.financedAmount ?? 0,
            totalOutstandingBalance:
               outstandingSummary._sum.outstandingBalance ?? 0,
         },
     
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



     export async function updateClientService(
      id: string,
      data: UpdateClientFormValues
    ) {
      if (
        data.addressType &&
        !Object.values(AddressType).includes(
          data.addressType as AddressType
        )
      ) {
        throw new Error("Invalid primary address type.");
      }
    
      if (
        data.addressType2 &&
        !Object.values(AddressType).includes(
          data.addressType2 as AddressType
        )
      ) {
        throw new Error("Invalid secondary address type.");
      }
    
      const updatedClient =
        await prisma.client.update({
          where: {
            id
          },
    
          data: {
            firstName: data.firstName,
            middleName: data.middleName || null,
            lastName: data.lastName,
            suffix: data.suffix || null,
    
            gender: data.gender
              ? {
                  connect: {
                    code: data.gender
                  }
                }
              : undefined,
    
            birthDate: data.birthDate
              ? new Date(data.birthDate)
              : undefined,
    
            placeOfBirth:
              data.placeOfBirth || null,
    
            civilStatus: data.civilStatus
              ? {
                  connect: {
                    code: Number(data.civilStatus)
                  }
                }
              : undefined,
    
            numberOfDependents:
              Number(data.numberOfDependents ?? 0),
    
            addressType: data.addressType
              ? (data.addressType as AddressType)
              : undefined,
    
            address: data.address || null,
    
            addressType2: data.addressType2
              ? (data.addressType2 as AddressType)
              : undefined,
    
            address2: data.address2 || null,
    
            identificationType:
              data.identificationType
                ? {
                    connect: {
                      code: Number(
                        data.identificationType
                      )
                    }
                  }
                : undefined,
    
            identificationNumber:
              data.identificationNumber || null,
    
            secondaryidentificationType:
              data.secondaryIdentificationType
                ? {
                    connect: {
                      code: Number(
                        data.secondaryIdentificationType
                      )
                    }
                  }
                : {
                    disconnect: true
                  },
    
            secondaryIdentificationNumber:
              data.secondaryIdentificationNumber ||
              null,
    
            contactType:
              data.contactType || undefined,
    
            contactValue:
              data.contactValue || null
          }
        });
    
      return updatedClient;
    }