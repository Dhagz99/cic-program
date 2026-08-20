import api from "@/lib/axios";
import type {
  ApiResponse,
  ClientPostalAuditResponse,
  CreatePostalCodeInput,
  PostalCodeResponse,
  UpdateClientPostalCodesPayload
} from "@repo/shared";


export async function getBranchPostalCodeAudit(
  branchId: string
): Promise<ClientPostalAuditResponse> {
  const response =
    await api.get(
      `/postal-codes/audit/${branchId}`
    );

  return response.data;
}

export async function updateClientPostalCodes(
  payload: UpdateClientPostalCodesPayload
) {
  const response =
    await api.put(
      "/postal-codes/update",
      payload
    );

  return response.data;
}


export async function createPostalCodeServices(
  data: CreatePostalCodeInput
) {
  const response = await api.post(
    "/postal-codes/create",
    data
  );

  return response.data;
}


  export const getPostalCodeService = 
    async (): Promise <PostalCodeResponse[]> => {
        const response = await api.get<ApiResponse<PostalCodeResponse[]>>(
          "/postal-codes/fetch-all"
        );
        return response.data.data
    } 