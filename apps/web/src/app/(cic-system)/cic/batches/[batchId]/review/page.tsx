"use client";

import { useParams }
from "next/navigation";

import {
   useApproveBatch
} from "@/hooks/cic/useApproveBatch";

export default function ReviewPage() {

   const params =
      useParams();

   const batchId =
      params.batchId as string;

   const approveBatch =
      useApproveBatch();

   return (

      <div className="p-6">

         <h1 className="
            text-2xl
            font-bold
            mb-6
         ">
            Review Batch
         </h1>

         <button

            onClick={() =>
               approveBatch.mutate(
                  batchId
               )
            }

            className="
               bg-green-600
               text-white
               px-4
               py-2
               rounded
            "
         >
            Approve Batch
         </button>

      </div>

   );

}