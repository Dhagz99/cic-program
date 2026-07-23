import { createReportingPeriodSchema } from "@repo/shared";
import { NextFunction, Request, Response } from "express";
import { createReportingPeriodService } from "./reporting-period.service";



export async function createReportingPeriodController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try{
    
        const validation = createReportingPeriodSchema.safeParse(
            req.body
        );

        if(!validation.success){
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors:
                    validation.error.flatten().fieldErrors,
            });
        }

        const reportingPeriod = 
            await createReportingPeriodService(
                validation.data
            );

            return res.status(201).json({
                success: true,
                message:
                    "Reporting period created successfully",
                data: reportingPeriod,
            });

    }catch(error){
        const message = 
            error instanceof Error
            ? error.message
            : "Failed to create reporting period."

        if(
            message.includes(
                "already exists"
            )
        ){
            return res.status(409).json({
                success: false,
                message
            })
        }
        next(error);
    }
}