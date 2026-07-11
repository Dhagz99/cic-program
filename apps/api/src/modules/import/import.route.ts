import { Router } from "express";
import { uploadDailyDbf } from "../cic/controllers/upload.controller";
import { authenticateToken } from "../auth/auth.middleware";
import multer from "multer";


const router = Router()

const upload = multer({
   dest: "uploads/daily"
});

router.post("/daily-import",    authenticateToken,
   upload.single("file"),
   uploadDailyDbf);


export default router