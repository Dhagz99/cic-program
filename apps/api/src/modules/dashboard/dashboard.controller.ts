// controllers/dashboard.controller.ts

import { Request, Response } from "express";
import { DashboardServices } from "./dashboard.service";

export async function DashboardController(
   req: Request,
   res: Response
) {

   try {

      const user =
         req.user;

         const result =
         await DashboardServices({
      
            branchId:
               user?.branchId ?? undefined,
      
            isAdmin:
               user?.roles?.includes("ADMIN") ?? false
      
         });

      return res.status(200).json({

         success: true,

         data: result

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,

         message:
            "Failed to load dashboard"

      });

   }

}