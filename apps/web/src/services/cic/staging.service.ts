import api from "@/lib/axios";
import { UpdateLoanFormValues } from "@repo/shared";

type UpdateStagingContractParams = {

   id: string;

   values: UpdateLoanFormValues;

};

export const updateStagingClient =
async (
   id: string,
   payload: any
) => {

   const response =
      await api.put(
         `/staging/client/${id}`,
         payload
      );

   return response.data;

};

export async function updateStagingContract({

   id,

   values

}: UpdateStagingContractParams) {

   const response =
      await api.patch(

         `/cic/staging-contracts/${id}`,

         values

      );

   return response.data;

}

export const confirmStagingClient =
async (
   id: string
) => {

   const response =
      await api.post(
         `/staging/client/${id}/confirm`
      );

   return response.data;

};

export const confirmStagingContract =
async (
   id: string
) => {

   const response =
      await api.post(
         `/staging/contract/${id}/confirm`
      );

   return response.data;

};


