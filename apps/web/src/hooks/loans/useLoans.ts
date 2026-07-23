"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  ClientLoanPaginationResponse,
  GetClientLoansParams
} from "@repo/shared";

import {
  getClientLoansPaginationService
} from "@/services/loan.service";

export function useClientLoan({
  page = 1,
  limit = 10,
  search = "",
  contractPhase
}: GetClientLoansParams) {
  const loansQuery =
    useQuery<ClientLoanPaginationResponse>({
      queryKey: [
        "client-loans",
        {
          page,
          limit,
          search,
          contractPhase
        }
      ],

      queryFn: () =>
        getClientLoansPaginationService({
          page,
          limit,
          search,
          contractPhase
        }),

      staleTime: 1000 * 60 * 5,

      placeholderData:
        previousData => previousData
    });

  const pagination =
    loansQuery.data?.pagination;

  return {
    ...loansQuery,

    loans:
      loansQuery.data?.data ?? [],

    pagination,

    total:
      pagination?.total ?? 0,

    totalPages:
      pagination?.totalPages ?? 0,

    currentPage:
      pagination?.page ?? page,

    pageSize:
      pagination?.limit ?? limit,

    summary:
      loansQuery.data?.summary ?? {
        activeLoans: 0,
        pastDueLoans: 0,
        totalLoanAmount: 0,
        totalLoans: 0
      }
  };
}