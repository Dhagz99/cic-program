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