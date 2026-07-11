// src/modules/external/controllers/externalClient.controller.ts

import { Request, Response } from "express";
import { getExternalClientByAccountService, getExternalClientsByBranchService, getExternalClientsService } from "../services/getExternalClients.service";

export const getExternalClientsController = async (
   req: Request,
   res: Response
) => {
   const result = await getExternalClientsService({
      search: req.query.search as string,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 50),
   });

   return res.json(result);
};


export const getExternalClientByAccountController = async (
   req: Request,
   res: Response
) => {
try{
   const { branchId, accountNo } = req.params;

   if (!branchId) {
      return res.status(400).json({
         message: "Branch ID is required",
      });
   }


   if(!accountNo) {
      return res.status(400).json({
         message: "Account number is required",
      });
   }

   const result = await getExternalClientByAccountService(
      branchId,
      accountNo
   );


   return res.json({
      data: result
   });

}
catch(error){
   return res.status(404).json({
      message:
         error instanceof Error
            ? error.message
            : "Client not found",
   });
}

}


export const getExternalClientsByBranch = async (
   req: Request,
   res: Response
 ) => {
   try {
     const { branchId } = req.params;
 
     if (!branchId) {
       return res.status(400).json({
         message: "Branch ID is required",
       });
     }
 
     const clients =
       await getExternalClientsByBranchService(
         branchId
       );
 
     return res.json({
       data: clients,
       total: clients.length,
     });
   } catch (error) {
     return res.status(500).json({
       message:
         error instanceof Error
           ? error.message
           : "Failed to get branch clients",
     });
   }
 };