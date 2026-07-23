import api from "@/lib/axios";
import { CreateReportingPeriodInput } from "@repo/shared";

export async function createReportingService(payload: CreateReportingPeriodInput) {
    const response =  await api.post(
        "/reporting-periods",
        payload
    );

    return response.data;
}

export async function getReportingPeriodsService() {
    const response = await api.get(
        "/reporting-periods"
    );

    return response.data;
    
}