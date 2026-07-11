import { Request, Response } from "express";

import {
   uploadDbfService
} from "../services/upload/upload.service";
import { uploadDailyDbfService } from "../../import/daily/uploadDaily.service";

export const uploadDbf = async (
   req: Request,
   res: Response
) => {

   try {

      const file = req.file;

      const reportingPeriodId =
         req.body.reportingPeriodId;

      const user = req.user;

      if (!file) {

         return res.status(400).json({
            message: "DBF file required"
         });
      }

      const result =
         await uploadDbfService({
            file,
            reportingPeriodId,
            user
         });

      return res.status(200).json(result);

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};


export const uploadDailyDbf = async (
   req: Request,
   res: Response
) => {
   try {

      const file = req.file;
      const user = req.user;
      if (!file) {
         return res.status(400).json({
            message: "DBF file required"
         });
      }
      const result =
         await uploadDailyDbfService({
            file,
            user
         });
      return res.status(200).json(result);

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};