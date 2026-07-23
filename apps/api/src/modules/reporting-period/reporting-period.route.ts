import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { createReportingPeriodController } from "./reporting-period.controller";



const router = Router();


router.post("/", authenticateToken, createReportingPeriodController);

export default router;