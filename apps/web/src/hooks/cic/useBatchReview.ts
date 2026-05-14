"use client";

import {
   useQuery
} from "@tanstack/react-query";

import {
   getBatchReview
} from "@/services/cic/review.service";
import { StagingClient } from "@repo/shared";



export const useBatchReview =
(
   batchId: string
) => {

   return useQuery<StagingClient[]>({

      queryKey: [
         "batch-review",
         batchId
      ],

      queryFn: () =>
         getBatchReview(batchId)

   });

};