import { Router } from "express"
import { authenticateToken } from "../auth/auth.middleware"
import { getClientLoansController } from "./loan.controller"


const router = Router()

router.get( "/client-loan-paginated",authenticateToken, getClientLoansController)

export default router;