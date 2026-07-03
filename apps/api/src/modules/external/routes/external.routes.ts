// src/modules/external/routes/external.routes.ts

import express from "express";
import { externalApiAuth } from "../../../middleware/externalApiAuth.middleware";
import { getExternalClientsController } from "../controller/externalClient.controller";


const router = express.Router();

router.get(
   "/clients",
   externalApiAuth,
   getExternalClientsController
);

export default router;