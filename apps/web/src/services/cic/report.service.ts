import api from "@/lib/axios";
import { ImportBatchItem, ReportingPeriod } from "@repo/shared";

export const exportReport =
async (
   batchId: string
) => {

   const response =
      await api.get(

         `/reports/${batchId}/export`,

         {

            responseType:
               "blob"

         }

      );

   return response.data;

};
export const getImportBatches =
async (): Promise<ImportBatchItem[]> => {

   const response =
      await api.get(
         "/reports/import-batches"
      );

   return response.data.data;

};


export const getReportingPeriods =
async (): Promise<ReportingPeriod[]> => {

   const response =
      await api.get(
         "/reports/reporting-periods"
      );

   return response.data.data;

};