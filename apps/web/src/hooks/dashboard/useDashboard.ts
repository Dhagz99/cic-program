import { getDashboardData } from "@/services/dashboard.service";
import { DashboardResponse } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export function useDashboard(){
    const dashboardQuery = 
        useQuery<DashboardResponse>({
            queryKey: ["dashboard"],
            queryFn: getDashboardData,
            staleTime: 1000 * 60 * 5,
            placeholderData:
                previousData =>
                previousData,
        })

    return dashboardQuery
}