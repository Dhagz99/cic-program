import { updateClient } from "@/services/cic/batch.service";
import { UpdateClientDTO } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateClient() {

    const queryClient = useQueryClient();
 
    return useMutation({
 
       mutationFn: ({
          id,
          values
       }: {
          id: string;
          values: UpdateClientDTO;
       }) =>
          updateClient(id, values),
 
       onSuccess: () => {
 
          queryClient.invalidateQueries({
             queryKey: ["clients"]
          });
 
       },
 
       onError: (error: Error) => {

        toast.error(
           error.message ||
           "Failed to update client"
        );
     
     }
 
    });
 
 }
 