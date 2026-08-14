// controllers/client.controller.ts

import { NextFunction, Request, Response } from "express";
import { getClientContractsService, getClientsPaginationService, getClientsService, getDailyImportService, updateClientAddressService, updateClientService, updateDailyClientService } from "./client.service";
import { updateClientAddressSchema, UpdateClientFormValues } from "@repo/shared";


export async function getClientsController(
   req: Request,
   res: Response
) {
   try {

      const user = req.user;

      const branchId =
         user?.branchId;

      if (!branchId) {
         return res.status(400).json({
            success: false,
            message: "Branch ID not found",
         });
      }

      const clients =
         await getClientsService(
            branchId
         );

      return res.status(200).json({
         success: true,
         data: clients,
      });

   } catch (error) {

      console.error(
         "[GET_CLIENTS_CONTROLLER]",
         error
      );

      return res.status(500).json({
         success: false,
         message: "Failed to fetch clients",
      });

   }
}



export async function getClientContractsController(
    req: Request,
    res: Response
 ) {
    try {
 
       const user = req.user;
 
       const branchId =
          user?.branchId;
 
       if (!branchId) {
          return res.status(400).json({
             success: false,
             message: "Branch ID not found",
          });
       }
 
       const contract =
          await getClientContractsService(
             branchId
          );
 
       return res.status(200).json({
          success: true,
          data: contract,
       });
 
    } catch (error) {
 
       console.error(
          "[GET_CLIENTS_CONTROLLER]",
          error
       );
 
       return res.status(500).json({
          success: false,
          message: "Failed to fetch clients",
       });
 
    }
 }

 
 export async function getClientsPaginationController(
    req: Request,
    res: Response
 ) {
    try {
 
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
 
       const genderCode =
          req.query.genderCode
             ? String(req.query.genderCode)
             : undefined;
 
       const civilStatusCode =
          req.query.civilStatusCode
             ? Number(req.query.civilStatusCode)
             : undefined;
 
       const result =
          await getClientsPaginationService({
             branchId,
             page,
             limit,
             search,
             genderCode,
             civilStatusCode,
             isAdmin
          });
 
       return res.status(200).json({
          success: true,
          ...result,
       });
 
    } catch (error) {
 
       console.error(
          "[GET_CLIENTS_CONTROLLER]",
          error
       );
 
       return res.status(500).json({
          success: false,
          message: "Failed to fetch clients",
       });
 
    }
 }


 export async function updateClientController(
   req: Request<{ id: string }>,
   res: Response
 ) {
   try {
     const { id } = req.params;
 
     if (!id) {
       return res.status(400).json({
         success: false,
         message: "Client ID is required."
       });
     }
 
     const data =
       req.body as UpdateClientFormValues;
 
     const updatedClient =
       await updateClientService(id, data);
 
     return res.status(200).json({
       success: true,
       message: "Client updated successfully.",
       data: updatedClient
     });
   } catch (error) {
     console.error(
       "Update client error:",
       error
     );
 
     if (
       error instanceof Error &&
       error.message.includes("Invalid")
     ) {
       return res.status(400).json({
         success: false,
         message: error.message
       });
     }
 
     return res.status(500).json({
       success: false,
       message:
         error instanceof Error
           ? error.message
           : "Failed to update client."
     });
   }
 }


  export async function updateDailyClientController(
   req: Request<{ id: string }>,
   res: Response
 ) {
   try {
     const { id } = req.params;
 
     if (!id) {
       return res.status(400).json({
         success: false,
         message: "Client ID is required."
       });
     }
 
     const data =
       req.body as UpdateClientFormValues;
 
     const updatedClient =
       await updateDailyClientService(id, data);
 
     return res.status(200).json({
       success: true,
       message: "Daily client updated successfully.",
       data: updatedClient
     });
   } catch (error) {
     console.error(
       "Update client error:",
       error
     );
 
     if (
       error instanceof Error &&
       error.message.includes("Invalid")
     ) {
       return res.status(400).json({
         success: false,
         message: error.message
       });
     }
 
     return res.status(500).json({
       success: false,
       message:
         error instanceof Error
           ? error.message
           : "Failed to update daily client."
     });
   }
 }



 export async function getDailyImportController(
   req: Request,
   res: Response
 ) {

   try{

      const user = req.user;

      const branchId = user?.branchId;

      if (!branchId) {
         return res.status(400).json({
            success: false,
            message: "Branch ID not found",
         });
      }

      const dailyImport  = await getDailyImportService(branchId);

      return res.status(201).json({
         success: true,
         data: dailyImport
      });


   }catch (error) {

      return res.status(500).json({
         success: false,
         message: "Failed to fetch daily import",
      });
   }

 }


 export async function updateClientAddressController(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
   try{

     const { id, address } = updateClientAddressSchema.parse({
      id: req.params.id,
      address: req.body.address,
    });

         const client  = await updateClientAddressService({
             id, 
            address
           }
         );

         return res.status(200).json({
            success: true,
            message: "Client address updated successfully.",
            data: client
         });


   }catch(error){
       next(error);
   }
   
 }