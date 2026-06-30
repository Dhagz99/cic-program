import { Request, Response } from "express";
import { getClientLoansServices } from "./loan.service";

export async function getClientLoansController(
    req: Request,
    res: Response
) {
    try{
        const user =
        req.user;

        const isAdmin =
            (user?.roles?.includes("ADMIN") || user?.permissions?.includes("MANAGER_ADMIN") ) ?? false;
     
        const branchId =
        isAdmin
           ? undefined
           : user?.branchId ?? undefined;
     
     if (!isAdmin && !branchId) {
        throw new Error("Branch user has no assigned branch");
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
                  isAdmin
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