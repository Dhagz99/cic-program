import {

    Request,
    Response
 
 } from "express";
import { generateReportService, getImportBatchesService, getReportingPeriodsService,  } from "./generateReport.service";
 

 
export const generateReport = async (
   req: Request,
   res: Response
) => {
   try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
         return res.status(400).json({
            success: false,
            message: "User ID not found",
         });
      }

      const { batchId } = req.params;

      const result = await generateReportService({
         batchId,
         userId: String(userId),
      });

      /*
      |--------------------------------------------------------------------------
      | VALIDATION FAILED
      |--------------------------------------------------------------------------
      */

      if (!result.success) {
         return res.status(422).json({
            success: false,
            message: result.message,
            totalErrors: result.totalErrors,
            validationErrors: result.errors,
         });
      }

      /*
      |--------------------------------------------------------------------------
      | DOWNLOAD FILE
      |--------------------------------------------------------------------------
      */

      res.setHeader(
         "Content-Type",
         "text/plain; charset=utf-8"
      );

      res.setHeader(
         "Content-Disposition",
         `attachment; filename="${result.fileName}"`
      );

      return res.status(200).send(result.content);
   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to generate report",
      });
   }
};


 export const getImportBatches =
async (
   req: Request,
   res: Response
) => {

   try {

      const batches =
         await getImportBatchesService();

      return res.status(200).json({

         success: true,

         data:
            batches

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,

         message:
            "Failed to fetch import batches"

      });

   }

};


export const getReportingPeriods =
async (
   req: Request,
   res: Response
) => {

   try {

      const periods =
         await getReportingPeriodsService();

      return res.status(200).json({

         success: true,

         data: periods

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,

         message:
            "Failed to fetch periods"

      });

   }

};