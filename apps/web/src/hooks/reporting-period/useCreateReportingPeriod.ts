import { createReportingService } from "@/services/reporting-period/reporting.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateReportingPeriod(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReportingService,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["reporting-periods"]
            });
        },
    });
}