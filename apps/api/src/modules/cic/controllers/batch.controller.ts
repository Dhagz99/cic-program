import { Request, Response }
from "express";

import {
   submitBatchService
} from "../services/batch/submitBatch.service";

import {
   approveBatchService
} from "../services/batch/approveBatch.service";

import {
   returnBatchService
} from "../services/batch/returnBatch.service";

import {
   finalizeBatchService
} from "../services/batch/finalizeBatch.service";

/*
-----------------------------------
SUBMIT
-----------------------------------
*/

export const submitBatch =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await submitBatchService({

            batchId:
               req.params.batchId,

            userId:
            (req as any).user.id
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
APPROVE
-----------------------------------
*/

export const approveBatch =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await approveBatchService({

            batchId:
               req.params.batchId,

               userId:
               (req as any).user.id
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
RETURN
-----------------------------------
*/

export const returnBatch =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await returnBatchService({

            batchId:
               req.params.batchId,

            userId:
            (req as any).user.id,

            reason:
               req.body.reason
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
FINALIZE
-----------------------------------
*/

export const finalizeBatch =
async (
   req: Request,
   res: Response
) => {

   try {

      const result =
         await finalizeBatchService({

            batchId:
               req.params.batchId
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