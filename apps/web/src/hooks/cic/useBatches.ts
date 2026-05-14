"use client";

import { useQuery }
from "@tanstack/react-query";

import {
   getBatches
} from "@/services/cic/batch.service";

export const useBatches =
() => {

   return useQuery({

      queryKey: ["batches"],

      queryFn: getBatches

   });

};