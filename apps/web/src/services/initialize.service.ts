import api from "@/lib/axios";
import { ImportBatchItem } from "@repo/shared";

export const getLastImportBatchService = async() : Promise<ImportBatchItem> => {
    const response = await api.get(
        "initialize/last-import"
    )

    return response.data.data
}