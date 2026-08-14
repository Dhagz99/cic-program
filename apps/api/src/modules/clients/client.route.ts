import { Router } from "express";
import { getClientsController, getClientsPaginationController, getDailyImportController, updateClientAddressController, updateClientController, updateDailyClientController } from "./client.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router()

router.get("/get-clients", authenticateToken, getClientsController)
router.get("/get-contracts", authenticateToken, getClientsController)
router.get( "/clients-paginated",authenticateToken, getClientsPaginationController);
router.put( "/update-clients/:id",authenticateToken, updateClientController);
router.put( "/daily-clients/:id",authenticateToken, updateDailyClientController);
router.get("/daily-imports", authenticateToken, getDailyImportController);
router.put("/update-address/:id", authenticateToken, updateClientAddressController);



export default router