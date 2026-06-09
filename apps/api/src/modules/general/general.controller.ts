import { createBranchSchema } from "@repo/shared";
import { error } from "console";
import { Request, Response } from "express";
import { createBranchService, getBranchesDetailsService, getDomainByTypeService } from "./general.service";



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


export async function getBranchesDetailsController(
    req: Request,
    res: Response
  ) {
  
    try{
      const branches = await getBranchesDetailsService()
      res.status(200).json({
        success: true,
        data: branches
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch branches"
      });
    }
    
  }


  export async function getDomainByTypeController(
      req: Request,
      res: Response
  ) {
      const { type } = req.query;

      const data = await getDomainByTypeService(
        String(type)
      );

      return res.json({
        success: true,
        data
      });
  }