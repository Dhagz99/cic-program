import { Router } from "express";
import { getClientsController, getClientsPaginationController } from "./client.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router()

router.get("/get-clients", authenticateToken, getClientsController)
router.get("/get-contracts", authenticateToken, getClientsController)
router.get( "/clients-paginated",authenticateToken, getClientsPaginationController
 );

export default router