import { Router } from "express";
import multer from "multer";
import { uploadDbfController } from "./dbf.controller";


const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/upload",
  upload.single("file"),
  uploadDbfController
);

export default router;