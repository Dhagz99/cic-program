import { CreateReportingPeriodInput } from "@repo/shared";
import prisma from "../../lib/prisma";
import { Prisma, ReportingStatus } from "@prisma/client";

export async function createReportingPeriodService(payload: CreateReportingPeriodInput ) {
    const existingReporting = 
        await prisma.reportingPeriod.findUnique({
            where: {
                month_year:{
                    month: payload.month,
                    year: payload.year
                },
            },
        });

        if(existingReporting){
            throw new Error(
                "A reporting period already exists for the selected month and year. "
            )
        }

        try{

            const reprotingPeriod =
                await prisma.reportingPeriod.create({
                data:{
                    month: payload.month,
                    year: payload.year,
                    status: 
                        payload.status ?? 
                        ReportingStatus.OPEN
                },
            });

            return reprotingPeriod;

        }catch(error){
             if (
            error instanceof
                Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
            ) {
            throw new Error(
                "A reporting period already exists for the selected month and year."
            );
            }

            throw error;
    }

}