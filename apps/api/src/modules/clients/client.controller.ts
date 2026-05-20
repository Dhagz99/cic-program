// controllers/client.controller.ts

import { Request, Response } from "express";
import { getClientContractsService, getClientsPaginationService, getClientsService } from "./client.service";


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