import api from "@/lib/axios";

/*
-----------------------------------
UPLOAD
-----------------------------------
*/

export const uploadDBF =
async (
   formData: FormData
) => {

   const response =
      await api.post(
         "/cic/upload",
         formData,
         {
            headers: {
               "Content-Type":
               "multipart/form-data"
            }
         }
      );

   return response.data;

};

/*
-----------------------------------
GET BATCHES
-----------------------------------
*/

export const getBatches =
async () => {

   const response =
      await api.get(
         "/api/cic/batches"
      );

   return response.data;

};

/*
-----------------------------------
GET BATCH DETAILS
-----------------------------------
*/

export const getBatchById =
async (
   batchId: string
) => {

   const response =
      await api.get(
         `/staging/batch/${batchId}`
      );

   return response.data;

};

/*
-----------------------------------
UPDATE CLIENT
-----------------------------------
*/

export const updateClient =
async (
   clientId: string,
   data: any
) => {

   const response =
      await api.put(
         `/api/staging/client/${clientId}`,
         data
      );

   return response.data;

};

/*
-----------------------------------
UPDATE CONTRACT
-----------------------------------
*/

export const updateContract =
async (
   contractId: string,
   data: any
) => {

   const response =
      await api.put(
         `/api/staging/contract/${contractId}`,
         data
      );

   return response.data;

};

/*
-----------------------------------
CONFIRM CLIENT
-----------------------------------
*/

export const confirmClient =
async (
   clientId: string
) => {

   const response =
      await api.post(
         `/api/staging/client/${clientId}/confirm`
      );

   return response.data;

};

/*
-----------------------------------
CONFIRM CONTRACT
-----------------------------------
*/

export const confirmContract =
async (
   contractId: string
) => {

   const response =
      await api.post(
         `/api/staging/contract/${contractId}/confirm`
      );

   return response.data;

};

/*
-----------------------------------
SUBMIT BATCH
-----------------------------------
*/

export const submitBatch =
async (
   batchId: string
) => {

   const response =
      await api.post(
         `/api/cic/batch/${batchId}/submit`
      );

   return response.data;

};

/*
-----------------------------------
APPROVE BATCH
-----------------------------------
*/

export const approveBatch =
async (
   batchId: string
) => {

   const response =
      await api.post(
         `/api/cic/batch/${batchId}/approve`
      );

   return response.data;

};

/*
-----------------------------------
RETURN BATCH
-----------------------------------
*/

export const returnBatch =
async (
   batchId: string,
   reason: string
) => {

   const response =
      await api.post(
         `/api/cic/batch/${batchId}/return`,
         { reason }
      );

   return response.data;

};

/*
-----------------------------------
FINALIZE
-----------------------------------
*/

export const finalizeBatch =
async (
   batchId: string
) => {

   const response =
      await api.post(
         `/api/cic/batch/${batchId}/finalize`
      );

   return response.data;

};