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
import { getBatchByIdService } from "../services/batch/viewBatch.service";
import { BatchDeleteRestrictedError, BatchNotFoundError, deleteBatchService } from "../services/batch/deleteBatch.service";

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
               req.params.id,

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



export const getBatchByIdController = async (
   req: Request,
   res: Response
) => {
   try {

      const {batchId} = req.params;
      const batch = await getBatchByIdService(batchId);

      return res.status(200).json({
         success: true,
         data: batch
      })

   } catch (error: any){
      if(error.message === "BATCH_NOT_FOUND"){
         return res.status(404).json({
            success: false,
            message: "Batch not found",
         });
      }

      return res.status(500).json({
         success: false,
         message: "Failed to get the batch",
      });
     
   }
}


export const deleteBatchController = async (
   req: Request,
   res: Response
) => {
   try {
      const { batchId } = req.params;

      const deletedBatch = await deleteBatchService(batchId);

      return res.status(200).json({
         success: true,
         message: "Batch deleted successfully.",
         data: deletedBatch,
      });
   } catch (error) {
      if (error instanceof BatchNotFoundError) {
         return res.status(404).json({
            success: false,
            message: error.message,
         });
      }

      if (error instanceof BatchDeleteRestrictedError) {
         return res.status(409).json({
            success: false,
            message: error.message,
         });
      }

      return res.status(500).json({
         success: false,
         message: "Failed to delete batch.",
      });
   }
};