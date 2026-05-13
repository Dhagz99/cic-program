import { createBranchSchema } from "@repo/shared";
import { error } from "console";
import { Request, Response } from "express";
import { createBranchService } from "./general.service";



export async function createBranchController(
    req: Request,
    res: Response
) {
    try{
        const parsed = createBranchSchema.safeParse(req.body)

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                error: parsed.error.flatten(),
            })
        }

        const branch = await createBranchService(parsed.data)
        
        return res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}