import { Router } from "express";
import { createBranchController, getBranchesDetailsController, getDomainByTypeController } from "./general.controller";


const router = Router()

router.post("/branch/create", createBranchController)
router.get("/branches", getBranchesDetailsController);
router.get("/domains", getDomainByTypeController);


export default router