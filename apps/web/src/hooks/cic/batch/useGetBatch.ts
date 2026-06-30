import { getBatchByIdService } from "@/services/cic/batch.service";
import { useQuery } from "@tanstack/react-query";


export const batchKeys = {
    all: ["batches"] as const,
  
    list: () =>
      [...batchKeys.all, "list"] as const,
  
    detail: (batchId: string) =>
      [...batchKeys.all, "detail", batchId] as const,
  
    review: (batchId: string) =>
      [...batchKeys.all, "review", batchId] as const,
  
    lastImport: () =>
      [...batchKeys.all, "last-import"] as const,
  
    initialize: () =>
      [...batchKeys.all, "initialize"] as const,
  };

export const useGetBatchById = (
  batchId?: string
) => {
  return useQuery({
    queryKey: batchKeys.detail(batchId ?? ""),
    queryFn: () => getBatchByIdService(batchId!),
    enabled: !!batchId,
  });
};