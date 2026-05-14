"use client";

import { useQuery }
from "@tanstack/react-query";

import {
   getBatchById
} from "@/services/cic/batch.service";

export const useBatchDetails =
(
   batchId: string
) => {

   return useQuery({

      queryKey: [
         "batch-details",
         batchId
      ],

      queryFn: () =>
         getBatchById(batchId),

      enabled: !!batchId

   });

};