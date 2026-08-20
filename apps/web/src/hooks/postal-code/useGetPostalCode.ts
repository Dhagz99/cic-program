import { getPostalCodeService } from "@/services/postal-code/postal-code.service";
import { useQuery } from "@tanstack/react-query";




export function useGetPostalCode(){
    return useQuery({
        queryKey: ["postal-code"],
        queryFn: getPostalCodeService,
    });
}