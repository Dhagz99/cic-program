import express from "express";
import multer from "multer";

import {
   uploadDbf
} from "../controllers/upload.controller";
import { authenticateToken } from "../../auth/auth.middleware";

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

export default router;