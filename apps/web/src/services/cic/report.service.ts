import api from "@/lib/axios";
import { ContractExportValidationError, ImportBatchItem, ReportingPeriod } from "@repo/shared";
import axios from "axios";

export const exportReport = async (
  batchId: string
): Promise<Blob> => {
  try {
    const response = await api.get(
      `/reports/${encodeURIComponent(batchId)}/export`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const data = error.response?.data;

    if (data instanceof Blob) {
      const text = await data.text();

      try {
        const parsed =
          JSON.parse(text) as ContractExportValidationError;

        throw parsed;
      } catch (parseError) {
        if (
          typeof parseError === "object" &&
          parseError !== null &&
          "validationErrors" in parseError
        ) {
          throw parseError;
        }

        throw new Error(
          "Failed to parse export validation response."
        );
      }
    }

    throw error;
  }
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