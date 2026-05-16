
import api from "@/lib/axios";

export const getGenderDomainService =
async () => {

   const response =
      await api.get(
         "/domain/gender"
      );

   return response.data;

};


export const getCivilStatusDomainService =
async () => {

   const response =
      await api.get(
         "/domain/civil-status"
      );

   return response.data;

};

export const getIdentificationTypeDomainService =
async () => {

   const response =
      await api.get(
         "/domain/identification-type"
      );

   return response.data;

};