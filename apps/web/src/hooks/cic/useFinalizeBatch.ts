import {
    useMutation
 } from "@tanstack/react-query";
 
 import {
    finalizeBatch
 } from "@/services/cic/batch.service";
 
 export const useFinalizeBatch =
 () => {
 
    return useMutation({
 
       mutationFn:
          finalizeBatch
 
    });
 
 };