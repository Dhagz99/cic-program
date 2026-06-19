// hooks/client/useClients.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import type {
   GetClientsParams
} from "@repo/shared";

import {
   getClientsPaginationService
} from "@/services/client.service";

export function useClients({
   page = 1,
   limit = 10,
   search = "",
   genderCode,
   civilStatusCode,
}: GetClientsParams) {

   const clientsQuery =
      useQuery({

         queryKey: [
            "clients",
            {
               page,
               limit,
               search,
               genderCode,
               civilStatusCode,
            },
         ],

         queryFn: async () => {

            return await getClientsPaginationService({
               page,
               limit,
               search,
               genderCode,
               civilStatusCode,
            });

         },

         staleTime:
            1000 * 60 * 5,

         placeholderData: (
            previousData
         ) => previousData,

         enabled:
            !!page &&
            !!limit,
      });

      

   return {

      // RAW QUERY
      ...clientsQuery,

      // CLEAN DATA
      clients:
         clientsQuery.data?.data || [],

      pagination:
         clientsQuery.data?.pagination,

      total:
         clientsQuery.data?.pagination?.total || 0,

      totalPages:
         clientsQuery.data?.pagination?.totalPages || 0,

      currentPage:
         clientsQuery.data?.pagination?.page || 1,

      pageSize:
         clientsQuery.data?.pagination?.limit || 10,

      totalBorrowers:
         clientsQuery.data?.summary?.totalBorrowers || 0,
      
      totalContracts:
         clientsQuery.data?.summary?.totalContracts || 0,

      totalFinancedAmount:
         clientsQuery.data?.summary?.totalFinancedAmount || 0,

      totalOutstandingBalance:
         clientsQuery.data?.summary?.totalOutstandingBalance || 0,
   };
}