import { Request, Response } from "express";

import {
   getInitializeService,
   getLastImportBatchService
} from "./initialize.service";

export async function getLastImportBatchController(
   req: Request,
   res: Response
) {
   try {

      const user = req.user;

      const isAdmin =
      user?.roles?.includes("ADMIN") ?? false;
   
      const branchId =
      isAdmin
         ? undefined
         : user?.branchId ?? undefined;
   
   if (!isAdmin && !branchId) {
      throw new Error("Branch user has no assigned branch");
   }
   

      const result =
         await getLastImportBatchService(
            branchId
         );

      return res.status(200).json({
         success: true,
         data: result
      });
     

   } catch (error) {

      console.error(
         "getLastImportBatchController:",
         error
      );

      return res.status(500).json({
         success: false,
         message:
            "Failed to get import batch"
      });

   }
}


export async function getInitializeController(
   req: Request,
   res: Response
) {
   try{

      const user = req.user;

      const isAdmin =
      user?.roles?.includes("ADMIN") ?? false;
   
      const branchId =
      isAdmin
         ? undefined
         : user?.branchId ?? undefined;
   
   if (!isAdmin && !branchId) {
      throw new Error("Branch user has no assigned branch");
   }
   
      const result = await getInitializeService({
         branchId,
         isAdmin,
         page: Number(req.query.page) || 1,
         limit: Number(req.query.limit) || 10,
         search: String(req.query.search || ""),
      });

      return res.status(200).json({
         success: true,
         data: result
      });

   }catch (error) {

      console.error(
         "getInitializeController:",
         error
      );

      return res.status(500).json({
         success: false,
         message:
            "Failed to get import batch"
      });

   }
}