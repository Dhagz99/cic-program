import z from "zod";
export const createBranchSchema = z.object({
    branchCode: z.string().min(1),
    branchName: z.string().min(1),
});
export const branchSchema = z.object({
    id: z.string(),
    branchCode: z.string(),
    branchName: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
