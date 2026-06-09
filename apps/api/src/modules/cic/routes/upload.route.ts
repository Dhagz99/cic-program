import express from "express";
import multer from "multer";

import {
   uploadDbf
} from "../controllers/upload.controller";
import { authenticateToken } from "../../auth/auth.middleware";
import { updateStagingContract } from "../controllers/staging.controller";
import { submitBatch } from "../controllers/batch.controller";

const router = express.Router();

const upload = multer({
   dest: "uploads/temp"
});

router.post(
   "/upload",
   authenticateToken,
   upload.single("file"),
   uploadDbf
);

router.patch(
   "/staging-contracts/:id",
   updateStagingContract
)

router.patch(
   "/batch/:id/submit",
   authenticateToken,
   submitBatch
)


export default router;