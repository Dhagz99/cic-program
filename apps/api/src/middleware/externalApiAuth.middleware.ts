// src/middlewares/externalApiAuth.middleware.ts

import { Request, Response, NextFunction } from "express";

export const externalApiAuth = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const apiKey = req.headers["x-api-key"];


   if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
      return res.status(401).json({
         message: "Unauthorized external API access"
      });
   }

   next();
};