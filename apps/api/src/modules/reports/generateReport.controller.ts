import {

    Request,
    Response
 
 } from "express";
import { generateReportService, getImportBatchesService, getReportingPeriodsService,  } from "./generateReport.service";
 

 
 export const generateReport =
 async (
    req: Request,
    res: Response
 ) => {
 
    try {
 
       const { batchId } =
          req.params;
 
       const result =
          await generateReportService({
 
             batchId
 
          });
 
       /*
       |--------------------------------------------------------------------------
       | DOWNLOAD FILE
       |--------------------------------------------------------------------------
       */
 
       res.setHeader(
          "Content-Type",
          "text/plain"
       );
 
       res.setHeader(
          "Content-Disposition",
          `attachment; filename=${result.fileName}`
       );
 
       return res.send(
          result.content
       );
 
    } catch (error) {
 
       console.error(error);
 
       return res.status(500).json({
 
          success: false,
 
          message:
             "Failed to generate report"
 
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