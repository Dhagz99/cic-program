import type {
  NextFunction,
  Request,
  Response
} from "express";

import {
  createPostalCodeSchema,
  updateClientPostalCodesSchema
} from "@repo/shared";

import {
  auditBranchPostalCodesService,
  createPostalCodeService,
  getPostalCodeService,
  updateClientPostalCodesService
} from "./postal-code.service";

export async function auditBranchPostalCodesController(
  req: Request,
  res: Response
) {
  try {
    const { branchId } =
      req.params;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message:
          "Branch ID is required."
      });
    }

    const result =
      await auditBranchPostalCodesService(
        branchId
      );

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Postal-code audit failed."
    });
  }
}

export async function updateClientPostalCodesController(
  req: Request,
  res: Response
) {
  try {
    const parsed =
      updateClientPostalCodesSchema.safeParse(
        req.body
      );

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid postal-code update request.",
        errors:
          parsed.error.flatten()
      });
    }

    const result =
      await updateClientPostalCodesService(
        parsed.data
      );

    return res.json({
      success: true,
      message:
        `${result.updated} client postal codes updated.`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Postal-code update failed."
    });
  }
}


export async function createPostalCodeController(
  req: Request,
  res: Response,
  next: NextFunction
){
    try{

      const data = createPostalCodeSchema.parse(req.body)


      const postalCode = await createPostalCodeService(data);

      return res.status(201).json({
      success: true,
      message: "Postal code created successfully.",
      data: postalCode,
    });

    }catch(error){
      next(error)
    }
}


export async function getPostalCodeController(
 req: Request,
 res: Response,
 next: NextFunction
) {
  try{

      const postalCode = await getPostalCodeService();

      return res.status(200).json({
        success: true,
        data: postalCode
      })

  }catch(error){
    next(error)
  }
  
}