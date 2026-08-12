import { deleteBatchByIdService } from "@/services/cic/batch.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteBatch = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (batchId: string) =>  
            deleteBatchByIdService(batchId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["initialize"],
            });
             queryClient.invalidateQueries({
                queryKey:["last-import"],
            });
        },
    });
}

