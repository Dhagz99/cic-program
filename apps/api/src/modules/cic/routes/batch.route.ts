import express from "express";

import {
   submitBatch,
   approveBatch,
   returnBatch,
   finalizeBatch
} from "../controllers/batch.controller";
import { authenticateToken } from "../../auth/auth.middleware";

const router = express.Router();

/*
-----------------------------------
SUBMIT BATCH
-----------------------------------
*/

router.post(
   "/:batchId/submit",
   authenticateToken,
   submitBatch
);

/*
-----------------------------------
APPROVE BATCH
-----------------------------------
*/

router.post(
   "/:batchId/approve",
   authenticateToken,
   approveBatch
);

/*
-----------------------------------
RETURN BATCH
-----------------------------------
*/

router.post(
   "/:batchId/return",
   authenticateToken,
   returnBatch
);

/*
-----------------------------------
FINALIZE BATCH
-----------------------------------
*/

router.post(
   "/:batchId/finalize",
   authenticateToken,
   finalizeBatch
);

export default router;