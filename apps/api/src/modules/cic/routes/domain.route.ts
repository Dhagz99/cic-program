// routes/domain.routes.ts
import express from "express";
import { getCivilStatusDomainController, getGenderDomainController, getIdentificationTypeDomainController } from "../controllers/domain.controller";

const router = express.Router();
router.get(
    "/gender",
    getGenderDomainController
 );
 
 router.get(
    "/civil-status",
    getCivilStatusDomainController
 );
 
 router.get(
    "/identification-type",
    getIdentificationTypeDomainController
 );
 
 export default router;