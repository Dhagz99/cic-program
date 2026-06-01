import { GetClientLoansParams } from "@repo/shared";
import prisma from "../../lib/prisma";

export async function getClientLoansServices({
    branchId,
    page = 1,
    limit = 10,
    search = "",
    contractPhase
}: GetClientLoansParams) {
    const skip = 
        (page - 1 ) * limit;

    const whereCondition: any = {
        branchId,

        ...(contractPhase && {
            contractPhase
        }),
        
        ...(search && {
            OR: [
                {
                    contractNo:{
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
          
        })

    };

    const [contracts, total] = 
        await Promise.all([
            prisma.contract.findMany({
                where: whereCondition,
                
                skip,

                take: limit,

                orderBy: {
                    contractNo: "asc"
                },
                include:{
                    client: true
                }
            }),

            prisma.contract.count({
                where: whereCondition
            }),
        ]);

        return {
            data: contracts,
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