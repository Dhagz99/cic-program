import { getReportingPeriodsService } from "@/services/reporting-period/reporting.service";
import { useQuery } from "@tanstack/react-query";

export function useReportingPeriods() {
    return useQuery({
        queryKey: ["reporting-periods"],
        queryFn: getReportingPeriodsService,
    });
}