import { Request, Response } from "express";
import { getClientLoansServices } from "./loan.service";

export async function getClientLoansController(
    req: Request,
    res: Response
) {
    try{
        const user =
        req.user;

     const branchId =
        user?.branchId;

     if (!branchId) {
        return res.status(400).json({
           success: false,
           message: "Branch ID not found",
        });
     }

       const page =
               Number(req.query.page) || 1;
      
            const limit =
               Number(req.query.limit) || 10;
      
            const search =
               String(req.query.search || "");
      
            const contractPhase =
               req.query.contractPhase
                  ? String(req.query.contractPhase)
                  : undefined;
      
            const result =
               await getClientLoansServices({
                  branchId,
                  page,
                  limit,
                  search,
                  contractPhase,
               });
      
            return res.status(200).json({
               success: true,
               ...result,
            });
      

    }catch (error) {
 
        console.error(
           "[GET_CLIENTS_LOAN_CONTROLLER]",
           error
        );
  
        return res.status(500).json({
           success: false,
           message: "Failed to fetch client loans",
        });
  
     }
}