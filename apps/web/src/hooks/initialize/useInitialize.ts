import { getInitializePaginationService, getLastImportBatchService } from "@/services/initialize.service";
import { ImportBatchItem, InitializeParams } from "@repo/shared";
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

export function useInitialize({
    page = 1,
    limit = 10,
    search = "",
  }: InitializeParams) {
    return useQuery({
      queryKey: [
        "initialize",
        {
          page,
          limit,
          search,
        },
      ],
  
      queryFn: () =>
        getInitializePaginationService({
          page,
          limit,
          search,
        }),
  
      staleTime: 1000 * 60 * 5,
  
      placeholderData: (previousData) => previousData,
    });
  }