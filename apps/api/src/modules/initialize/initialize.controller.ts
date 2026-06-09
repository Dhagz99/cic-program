import { Request, Response } from "express";

import {
   getLastImportBatchService
} from "./initialize.service";

export async function getLastImportBatchController(
   req: Request,
   res: Response
) {
   try {

      const user = req.user;

      if (!user) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized"
         });
      }

      if (!user.branchId) {
         return res.status(400).json({
            success: false,
            message: "User is not assigned to a branch"
         });
      }

      const result =
         await getLastImportBatchService(
            user.branchId
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