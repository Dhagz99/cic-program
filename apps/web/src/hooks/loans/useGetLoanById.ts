import { getLoanByIdService } from "@/services/loan.service";
import { useQuery } from "@tanstack/react-query";

export function useGetLoanById(id: string) {
    return useQuery({
        queryKey: ["loan-by-id", id],
        queryFn: () => getLoanByIdService(id),
        enabled: Boolean(id),
    });
}