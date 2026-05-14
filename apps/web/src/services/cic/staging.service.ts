import api from "@/lib/axios";

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

export const updateStagingContract =
async (
   id: string,
   payload: any
) => {

   const response =
      await api.put(
         `/staging/contract/${id}`,
         payload
      );

   return response.data;

};

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