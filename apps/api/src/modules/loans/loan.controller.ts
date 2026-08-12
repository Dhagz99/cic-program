import { Request, Response } from "express";
import { getClientLoansServices, getLoanByIdService, updateLoanService } from "./loan.service";
import { updateLoanSchema, uuidSchema } from "@repo/shared";

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


export async function getLoanByIdController(
   req: Request,
   res: Response
) {
   try{
      const result = uuidSchema.safeParse(req.params.id);

      if(!result.success){
         return res.status(400).json({
            success: false,
            message: "Invalid loan ID."
         })
      }

      const loan = await getLoanByIdService(
         result.data
      )

      return res.status(200).json({
         success: true,
         data: loan
      })

   }catch(error){
      return res.status(404).json({
            success: false,
            message:
            error instanceof Error
               ? error.message
               : "Loan not found.",
         });
      }
}


export async function updateLoanController(
   req: Request,
   res: Response
) {
   try{

      const result = 
         updateLoanSchema.safeParse(req.body);

      if(!result.success){
         return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.flatten(),
         });
      }

      const loan = 
         await updateLoanService(
            req.params.id, 
            result.data
         );

      return res.status(200).json({
         succes: true,
         message: "Loan updated successfully",
         data: loan
      });

   }catch(error){
      return res.status(500).json({
            success: false,
            message:
            error instanceof Error
               ? error.message
               : "Failed to update loan.",
         });
   }
}