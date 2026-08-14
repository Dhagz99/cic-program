import {
  Request,
  Response,
  NextFunction,
} from "express";

import { Prisma } from "@prisma/client";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Prisma: record not found
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      success: false,
      message: "Record not found.",
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
}