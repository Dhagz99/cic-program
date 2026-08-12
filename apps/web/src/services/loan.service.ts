// services/loan.service.ts

import api from "@/lib/axios";

import type {
   ApiResponse,
   ClientLoan,
   ClientLoanPaginationResponse,
   GetClientLoansParams,
   UpdateLoanFormValues
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


export const getLoanByIdService = 
       async (
         id: string
      ) : Promise <ClientLoan> => {
      
      const response = await api.get<ApiResponse<ClientLoan>>(
         `/loans/by-id/${encodeURIComponent(id)}`
      );

      return response.data.data
}



export const updateLoanByIdService = 
   async(
      id:string,
      data: UpdateLoanFormValues
   ): Promise<ClientLoan> => {

      const response = await api.put<ApiResponse<ClientLoan>>(
            `/loans/update-loan/${encodeURIComponent(id)}`, 
            data
      )

      return response.data.data

   }

