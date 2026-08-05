"use client";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import type {
  UpdateClientPostalCodesPayload
} from "@repo/shared";
import { getBranchPostalCodeAudit, updateClientPostalCodes } from "@/services/postal-code/postal-code.service";



export function usePostalCodeAudit(
  branchId: string
) {
  return useQuery({
    queryKey: [
      "postal-code-audit",
      branchId
    ],

    queryFn: () =>
      getBranchPostalCodeAudit(
        branchId
      ),

    enabled: Boolean(branchId),

    staleTime: 0
  });
}

export function useUpdatePostalCodes(
  branchId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload:
        UpdateClientPostalCodesPayload
    ) =>
      updateClientPostalCodes(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "postal-code-audit",
          branchId
        ]
      });
    }
  });
}