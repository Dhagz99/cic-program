import { GetClientsParams, UpdateClientAddressParams, UpdateClientFormValues } from "@repo/shared";
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
                     secondaryIdentificationType: true,
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
    
            secondaryIdentificationType:
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


    export async function getDailyImportService(
      branchId: string
    ) {

      try{
         const dailyImports = await prisma.dailyImportBatch.findFirst({
         where:{
            branchId,
            status: "PROCESSING"
         },
         include:{
            dailyClients: {
              where: {
                isConfirmed: false
              }
            }
         }
      });
      return dailyImports;

      }catch(error){
         console.error(
            "Get Daily Import Service Error:",
            error
         );
         throw new Error(
            "Failed to fetch daily imports"
         );
      }
   }



    export async function updateDailyClientService(
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

      return prisma.$transaction(async (tx) => {

  const updatedClient =
        await tx.dailyStagingClient.update({
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
    
            secondaryIdentificationType:
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
              data.contactValue || null,
          },

          include:{
            gender: true,
            civilStatus: true,
            identificationType: true,
            secondaryIdentificationType: true,
            daily: true,
          }
        });

        const providerSubjectNo =
            updatedClient.providerSubjectNo;

        if (!providerSubjectNo) {
          throw new Error(
            "Provider subject number is required."
          );
        }

    const branchId =
      updatedClient.daily.branchId;

        const client =
          await tx.client.upsert({
            where: {
              branchId_providerSubjectNo:{
                 branchId,
                 providerSubjectNo
              }
          
            },

        update: {
          firstName: data.firstName.trim(),
          middleName:
            data.middleName?.trim() || null,
          lastName: data.lastName.trim(),
          suffix:
            data.suffix?.trim() || null,

          gender: data.gender
            ? {
                connect: {
                  code: data.gender
                }
              }
            : undefined,

          birthDate: data.birthDate
            ? new Date(data.birthDate)
            : null,

          placeOfBirth:
            data.placeOfBirth?.trim() || null,

          civilStatus: data.civilStatus
            ? {
                connect: {
                  code: Number(data.civilStatus)
                }
              }
            : undefined,

          numberOfDependents: Number(
            data.numberOfDependents ?? 0
          ),

         

          address:
            data.address?.trim() || null,

        
          address2:
            data.address2?.trim() || null,

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
            data.identificationNumber?.trim() ||
            null,

          secondaryIdentificationType:
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
            data.secondaryIdentificationNumber
              ?.trim() || null,

          contactType:
            data.contactType || null,

          contactValue:
            data.contactValue?.trim() || null
        },

       create: {
    providerSubjectNo,

    branch: {
      connect: {
        id: branchId
      }
    },

    dailyBatch: {
      connect: {
        id: updatedClient.dailyId
      }
    },

    firstName: data.firstName.trim(),
    middleName:
      data.middleName?.trim() || null,
    lastName: data.lastName.trim(),
    suffix:
      data.suffix?.trim() || null,

    gender: data.gender
      ? {
          connect: {
            code: data.gender
          }
        }
      : undefined,

    birthDate: data.birthDate
      ? new Date(data.birthDate)
      : null,

    placeOfBirth:
      data.placeOfBirth?.trim() || null,

    civilStatus: data.civilStatus
      ? {
          connect: {
            code: Number(data.civilStatus)
          }
        }
      : undefined,

    numberOfDependents: Number(
      data.numberOfDependents ?? 0
    ),

    address:
      data.address?.trim() || null,

    address2:
      data.address2?.trim() || null,

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
      data.identificationNumber?.trim() ||
      null,

    secondaryIdentificationType:
      data.secondaryIdentificationType
        ? {
            connect: {
              code: Number(
                data.secondaryIdentificationType
              )
            }
          }
        : undefined,

    secondaryIdentificationNumber:
      data.secondaryIdentificationNumber
        ?.trim() || null,

    contactType:
      data.contactType || null,

    contactValue:
      data.contactValue?.trim() || null
  }
});
   
    await tx.dailyStagingClient.update({
      where: {
        id
      },
      data: {
        isConfirmed: true
      }
    });

    const remainingUnconfirmed = 
        await tx.dailyStagingClient.count({
            where: {
              dailyId: updatedClient.dailyId,
              isConfirmed: false
            }
        });

    if(remainingUnconfirmed === 0){
      await tx.dailyImportBatch.update({
        where:{
          id: updatedClient.dailyId
        },
        data:{
          status: "COMPLETED"
        }
      })
    }

    return {
      stagingClient: updatedClient,
      client
    };
  });
}



export async function updateClientAddressService({
  id,
  address
}: UpdateClientAddressParams) {
  return prisma.client.update({
    where: { id },
    data: { address },
  });
}