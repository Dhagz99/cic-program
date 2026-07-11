// src/modules/external/routes/external.routes.ts

import express from "express";
import { externalApiAuth } from "../../../middleware/externalApiAuth.middleware";
import { getExternalClientByAccountController, getExternalClientsByBranch, getExternalClientsController } from "../controller/externalClient.controller";


const router = express.Router();

router.get(
   "/clients",
   externalApiAuth,
   getExternalClientsController
);


router.get(
   "/clients/:branchId/by-account/:accountNo",
   externalApiAuth,
   getExternalClientByAccountController
);


router.get(
   "/clients/:branchId",
   externalApiAuth,
   getExternalClientsByBranch
 );

export default router;