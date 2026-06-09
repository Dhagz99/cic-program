import {
    useMutation,
    useQueryClient
 } from "@tanstack/react-query";
 
 import {
    finalizeBatch
 } from "@/services/cic/batch.service";
 
 export const useFinalizeBatch =
 () => {
   const queryClient =
      useQueryClient();
    return useMutation({
      
       mutationFn:
          finalizeBatch,
          onSuccess: () => {
            queryClient.invalidateQueries({
               queryKey: ["last-import"]
             })
          } 
 
    });
 
 };