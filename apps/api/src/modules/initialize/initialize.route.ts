import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { getLastImportBatchController } from "./initialize.controller";

const router = Router();

router.get("/last-import", authenticateToken, getLastImportBatchController)


export default router