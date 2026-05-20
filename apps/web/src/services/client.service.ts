import api from "@/lib/axios";
import { GetClientsParams } from "@repo/shared";

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
