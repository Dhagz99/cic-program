"use client";

import {
   useQuery
} from "@tanstack/react-query";

import {
   getBatchReview
} from "@/services/cic/review.service";
import { ReviewClient } from "@/types/review.types";



export const useBatchReview =
(
   batchId: string
) => {

   return useQuery<ReviewClient[]>({

      queryKey: [
         "batch-review",
         batchId
      ],

      queryFn: () =>
         getBatchReview(batchId)

   });

};