import {
  Router
} from "express";

import {
  auditBranchPostalCodesController,
  updateClientPostalCodesController
} from "./postal-code.controller";

const router = Router();

router.get(
  "/audit/:branchId",
  auditBranchPostalCodesController
);

router.put(
  "/update",
  updateClientPostalCodesController
);

export default router;