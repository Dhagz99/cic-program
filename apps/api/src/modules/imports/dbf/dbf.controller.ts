import { Request, Response } from "express";

import { importDbfService } from "./dbf.service";

export async function uploadDbfController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await importDbfService(
      req.file.path
    );

    return res.status(200).json({
      success: true,
      imported: result.count,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Import failed",
    });
  }
}