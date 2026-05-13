import { Router } from "express";
import { createBranchController } from "./general.controller";


const router = Router()

router.post("/branch/create", createBranchController)

export default router