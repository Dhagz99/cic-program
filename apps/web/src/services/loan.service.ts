// services/loan.service.ts

import api from "@/lib/axios";

import type {
   ClientLoanPaginationResponse,
   GetClientLoansParams
} from "@repo/shared";

export const getClientLoansPaginationService =
async ({
   page,
   limit,
   search,
   contractPhase,
}: GetClientLoansParams)
: Promise<ClientLoanPaginationResponse> => {

   const response =
      await api.get(

         "/loans/client-loan-paginated",

         {

            params: {

               page,
               limit,
               search,
               contractPhase

            }

         }

      );

   return response.data;

};