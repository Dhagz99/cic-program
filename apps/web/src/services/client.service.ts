import api from "@/lib/axios";
import { GetClientsParams, UpdateClientFormValues, UploadDailyClientResponse } from "@repo/shared";

export async function getClientsPaginationService({ 
            page,
            limit,
            search,
            genderCode,
            civilStatusCode,
        }: GetClientsParams) {

            const response = await api.get("/clients/clients-paginated", {
                params: {
                    page,
                    limit,
                    search,
                    genderCode,
                    civilStatusCode,
                 },
            })
            return response.data;
    
}


export const uploadDailyClientFile = async (
  file: File
): Promise<UploadDailyClientResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<UploadDailyClientResponse>(
    "/import/daily-import",
    formData,
    {
      withCredentials: true,
    }
  );

  return response.data;
}


type UpdateClientResponse<TClient = unknown> = {
    success: boolean;
    message: string;
    data: TClient;
  };

export async function updateClient(
    id: string,
    data: UpdateClientFormValues
  ) {
    const response =
      await api.put<UpdateClientResponse>(
        `/clients/update-clients/${id}`,
        data
      );
  
    return response.data;
  }


  export async function updateDailyClient(
    id: string,
    data: UpdateClientFormValues
  ) {
    const response =
      await api.put<UpdateClientResponse>(
        `/clients/daily-clients/${id}`,
        data
      );
  
    return response.data;
  }



  export async function getDailyImportBatchService() {

    const response = await api.get(
      "/clients/daily-imports"
    );

    return response.data.data;

  }

