import api from "@/lib/axios";
import { DashboardResponse } from "@repo/shared";

export const getDashboardData = async() : Promise<DashboardResponse> => {
    const response = await api.get(
        "dashboard/dashboard"
    )
    return response.data
}