import api from "@/lib/axios";
import { ImportBatchItem, InitializeParams } from "@repo/shared";

export const getLastImportBatchService = async() : Promise<ImportBatchItem> => {
    const response = await api.get(
        "initialize/last-import"
    )
    return response.data.data
}


export async function getInitializePaginationService({
    page = 1,
    limit = 10,
    search = "",
  }: InitializeParams) {
    const response = await api.get("/initialize/get-initialize", {
      params: {
        page,
        limit,
        search,
      },
    });
  
    return response.data.data;
  }

