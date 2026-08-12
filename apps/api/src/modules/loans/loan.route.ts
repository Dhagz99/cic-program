import { Router } from "express"
import { authenticateToken } from "../auth/auth.middleware"
import { getClientLoansController, getLoanByIdController, updateLoanController } from "./loan.controller"


const router = Router()

router.get( "/client-loan-paginated",authenticateToken, getClientLoansController);
router.get("/by-id/:id", authenticateToken, getLoanByIdController);
router.put("/update-loan/:id", authenticateToken, updateLoanController);

export default router;