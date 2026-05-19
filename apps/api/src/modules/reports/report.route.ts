import {
    Router
 } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { generateReport, getImportBatches, getReportingPeriods } from "./generateReport.controller";
 

 
 const router =
    Router();
 
 router.get(
 
    "/:batchId/export",
 
    authenticateToken,
 
    generateReport
 
 );

 router.get(

    "/import-batches",
 
    authenticateToken,
 
    getImportBatches
 
 );

 router.get(

    "/reporting-periods",
 
    authenticateToken,
 
    getReportingPeriods
 
 );
 
 export default router;