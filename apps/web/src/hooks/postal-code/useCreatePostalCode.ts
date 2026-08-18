// hooks/postalCode/useCreatePostalCode.ts

import { createPostalCodeServices } from "@/services/postal-code/postal-code.service";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


export function useCreatePostalCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostalCodeServices,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postal-codes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["postal-code-audit"],
      });
    },
  });
}