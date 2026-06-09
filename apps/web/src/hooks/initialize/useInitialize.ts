import { getLastImportBatchService } from "@/services/initialize.service";
import { ImportBatchItem } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";

export function useLastImport(){
    const batch =
        useQuery<ImportBatchItem>({
            queryKey:["last-import"],
            queryFn:getLastImportBatchService,
            staleTime: 1000 * 60 * 5,
            placeholderData:
                previousData =>
                previousData,
        });

        return batch
}