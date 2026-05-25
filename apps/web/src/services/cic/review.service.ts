import api
from "@/lib/axios";
import { ReviewClient } from "@/types/review.types";
import { StagingClient, UpdateClientDTO } from "@repo/shared";


export const getBatchReview =
async (
   batchId: string
): Promise<ReviewClient[]> => {

   const response =
      await api.get(
         `/staging/batch/${batchId}`
      );

   return response.data;

};

export const updateClient =
async (
   clientId: string,
   payload: UpdateClientDTO
): Promise<StagingClient> => {

   const response =
      await api.put(
         `/staging/client/${clientId}`,
         payload
      );

   return response.data;

};