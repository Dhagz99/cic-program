import {
    useMutation,
    useQueryClient
 } from "@tanstack/react-query";
 
 import {
    finalizeBatch
 } from "@/services/cic/batch.service";
import { batchKeys } from "./batch/useGetBatch";
 
 export const useFinalizeBatch =
 () => {
   const queryClient =
      useQueryClient();
    return useMutation({
      
       mutationFn:
          finalizeBatch,
          onSuccess: (_, batchId) => {
            queryClient.invalidateQueries({
              queryKey: batchKeys.lastImport(),
            });
      
            queryClient.invalidateQueries({
              queryKey: batchKeys.initialize(),
            });
      
            queryClient.invalidateQueries({
              queryKey: batchKeys.list(),
            });
      
            queryClient.invalidateQueries({
              queryKey: batchKeys.detail(batchId),
            });

            queryClient.invalidateQueries({
              queryKey:["initialize"],
            });

         }
    });
 
 };