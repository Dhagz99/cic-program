import {
  Router
} from "express";

import {
  auditBranchPostalCodesController,
  createPostalCodeController,
  updateClientPostalCodesController
} from "./postal-code.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router();

router.get(
  "/audit/:branchId",
  auditBranchPostalCodesController
);

router.put(
  "/update",
  updateClientPostalCodesController
);


router.post(
  "/create",
  authenticateToken,
  createPostalCodeController
)

export default router;