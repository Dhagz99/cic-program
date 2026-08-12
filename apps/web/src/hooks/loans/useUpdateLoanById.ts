import { updateLoanByIdService } from "@/services/loan.service";
import { UpdateLoanFormValues } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateLoanPayload = {
    id: string,
    data:  UpdateLoanFormValues
}

export function useUpdateLoanById(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
         id,
         data
        }: UpdateLoanPayload ) => 
            updateLoanByIdService(id, data),
        
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["client-loans"]
            });

            await queryClient.invalidateQueries({
                queryKey: ["loan-by-id", variables.id]
            });
        }
    });

}