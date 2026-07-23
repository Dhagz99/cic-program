import { getDailyImportBatchService } from "@/services/client.service";
import { useQuery } from "@tanstack/react-query";

export function useGetDailyImport(){
    return useQuery({
        queryKey: ["import-daily"],
        queryFn: getDailyImportBatchService,
    })
}

