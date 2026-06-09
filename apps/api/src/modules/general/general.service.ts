import { BranchSchema } from "@repo/shared";
import prisma from "../../lib/prisma";

export async function  createBranchService(data: BranchSchema) {
    const {branchCode, branchName} = data

    const branch = await prisma.branch.create({
        data: {
            branchCode,
            branchName
        }
    })

    return branch

}

export const getBranchesDetailsService = async () => {
    return prisma.branch.findMany({
    });
  };


export async function getDomainByTypeService(
    type: string
) {
    return prisma.domain.findMany({
        where: {
            type
        },
        orderBy:{
            description: "asc"
        },
    });
}
