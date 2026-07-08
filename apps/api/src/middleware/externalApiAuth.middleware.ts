// src/middlewares/externalApiAuth.middleware.ts

import { Request, Response, NextFunction } from "express";

export const externalApiAuth = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const apiKey = req.header("x-api-key");

   console.log("Received API key:", apiKey);
   console.log("Expected API key:", process.env.EXTERNAL_API_KEY);

   if (!apiKey || apiKey.trim() !== process.env.EXTERNAL_API_KEY?.trim()) {
      return res.status(401).json({
         message: "Unauthorized external API access"
      });
   }

   next();
};