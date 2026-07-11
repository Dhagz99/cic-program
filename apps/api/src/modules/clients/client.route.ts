import { Router } from "express";
import { getClientsController, getClientsPaginationController, updateClientController } from "./client.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router()

router.get("/get-clients", authenticateToken, getClientsController)
router.get("/get-contracts", authenticateToken, getClientsController)
router.get( "/clients-paginated",authenticateToken, getClientsPaginationController);
router.put( "/update-clients/:id",authenticateToken, updateClientController);



export default router