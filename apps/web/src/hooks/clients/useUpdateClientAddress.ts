import { updateClientAddressServices } from "@/services/client.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export function useUpdateClientAddress(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientAddressServices,
    onSuccess: ()=> {
        queryClient.invalidateQueries({
            queryKey: ["postal-code-audit", branchId]
        })
    }
  });
} 