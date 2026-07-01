import { submitBatch } from "@/services/cic/batch.service";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSubmitBatch = () =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            batchId: string
         ) => submitBatch(batchId),
        onSuccess: () => {
             queryClient.invalidateQueries({
                queryKey: ["import-batches"]
            });

            queryClient.invalidateQueries({
                queryKey: ["initialize"]
            });
        },
    });
};