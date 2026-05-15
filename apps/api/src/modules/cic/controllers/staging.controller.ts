import { Request, Response }
   from "express";

import {
   getBatchStagingRecordsService
} from "../services/staging/getStagingRecords.service";



import {
   updateStagingContractService
} from "../services/staging/updateStagingContract.service";

import {
   confirmStagingRecordService
} from "../services/staging/confirmStagingRecord.service";
import { updateStagingClientService } from "../services/staging/updateStagingClient.services";

/*
-----------------------------------
GET RECORDS
-----------------------------------
*/

export const getBatchStagingRecords =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await getBatchStagingRecordsService(
            req.params.batchId
         );

      return res.status(200).json(
         result
      );

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};

/*
-----------------------------------
UPDATE CLIENT
-----------------------------------
*/

export const updateStagingClient =
async (
   req: Request,
   res: Response
) => {
   try {
      const result =
         await updateStagingClientService({
            id: req.params.id,
            data: req.body
         });

      return res.status(200).json(
         result
      );

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};

/*
-----------------------------------
UPDATE CONTRACT
-----------------------------------
*/

export const updateStagingContract =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await updateStagingContractService({
            id: req.params.id,
            data: req.body
         });

      return res.status(200).json(
         result
      );

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};

/*
-----------------------------------
CONFIRM CLIENT
-----------------------------------
*/

export const confirmStagingClient =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await confirmStagingRecordService({
            type: "CLIENT",
            id: req.params.id
         });

      return res.status(200).json(
         result
      );

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};

/*
-----------------------------------
CONFIRM CONTRACT
-----------------------------------
*/

export const confirmStagingContract =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await confirmStagingRecordService({
            type: "CONTRACT",
            id: req.params.id
         });

      return res.status(200).json(
         result
      );

   } catch (error: any) {

      return res.status(500).json({
         message: error.message
      });

   }

};