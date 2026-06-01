// hooks/loan/useClientLoan.ts

"use client";

import {
   useQuery
} from "@tanstack/react-query";

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

   contractPhase,

}: GetClientLoansParams) {

   const loansQuery =
      useQuery<ClientLoanPaginationResponse>({

         queryKey: [

            "client-loans",

            {
               page,
               limit,
               search,
               contractPhase,
            }

         ],

         queryFn: () =>
            getClientLoansPaginationService({

               page,
               limit,
               search,
               contractPhase,

            }),

         staleTime:
            1000 * 60 * 5,

         placeholderData:
            previousData =>
               previousData,

      });

   return {

      ...loansQuery,

      loans:
         loansQuery.data?.data ?? [],

      pagination:
         loansQuery.data?.pagination,

      total:
         loansQuery.data?.pagination?.total ?? 0,

      totalPages:
         loansQuery.data?.pagination?.totalPages ?? 0,

      currentPage:
         loansQuery.data?.pagination?.page ?? 1,

      pageSize:
         loansQuery.data?.pagination?.limit ?? 10,

   };

}