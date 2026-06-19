import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { getInitializeController, getLastImportBatchController } from "./initialize.controller";

const router = Router();

router.get("/last-import", authenticateToken, getLastImportBatchController)
router.get("/get-initialize", authenticateToken, getInitializeController )


export default router