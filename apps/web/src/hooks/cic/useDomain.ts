// hooks/useDomain.ts


import { getCivilStatusDomainService, getGenderDomainService, getIdentificationTypeDomainService } from "@/services/cic/domain.service";
import {
    useQuery
 }
 from "@tanstack/react-query";
 

 
 export const useGenderDomain =
 () => {
 
    return useQuery({
 
       queryKey: [
          "gender-domain"
       ],
 
       queryFn:
          getGenderDomainService
 
    });
 
 };


 export const useCivilStatusDomain =
 () => {
 
    return useQuery({
 
       queryKey: [
          "civil-status-domain"
       ],
 
       queryFn:
          getCivilStatusDomainService
    });
 
 };

 export const useIdentificationTypeDomain =
 () => {
    return useQuery({
 
       queryKey: [
          "identification-type-domain"
       ],
 
       queryFn:
          getIdentificationTypeDomainService
    });
 
 };



 