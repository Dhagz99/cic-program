import express from "express";

import {
   getBatchStagingRecords,
   updateStagingClient,
   updateStagingContract,
   confirmStagingClient,
   confirmStagingContract
} from "../controllers/staging.controller";

const router = express.Router();

/*
-----------------------------------
LOAD STAGING RECORDS
-----------------------------------
*/

router.get(
   "/batch/:batchId",
   getBatchStagingRecords
);

/*
-----------------------------------
UPDATE CLIENT
-----------------------------------
*/

router.put(
   "/client/:id",
   updateStagingClient
);

/*
-----------------------------------
UPDATE CONTRACT
-----------------------------------
*/

router.put(
   "/contract/:id",
   updateStagingContract
);

/*
-----------------------------------
CONFIRM CLIENT
-----------------------------------
*/

router.post(
   "/client/:id/confirm",
   confirmStagingClient
);

/*
-----------------------------------
CONFIRM CONTRACT
-----------------------------------
*/

router.post(
   "/contract/:id/confirm",
   confirmStagingContract
);

export default router;