import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
    "/dashboard",
    authenticateToken,
    DashboardController
 );

 export default router