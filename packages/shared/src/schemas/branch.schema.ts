import z from "zod";

export const createBranchSchema = z.object({
        branchCode: z.string().min(1),
        branchName: z.string().min(1),
})

export type BranchSchema = z.infer<typeof createBranchSchema>