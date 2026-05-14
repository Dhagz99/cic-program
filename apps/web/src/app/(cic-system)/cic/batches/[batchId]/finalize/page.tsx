"use client";

import { useParams }
from "next/navigation";

;

export default function FinalizePage() {

   const params =
      useParams();

   const batchId =
      params.batchId as string;

   const finalizeBatch =
      useFinalizeBatch();

   return (

      <div className="p-6">

         <h1 className="
            text-2xl
            font-bold
            mb-6
         ">
            Finalize Batch
         </h1>

         <button

            onClick={() =>
               finalizeBatch.mutate(
                  batchId
               )
            }

            className="
               bg-purple-600
               text-white
               px-4
               py-2
               rounded
            "
         >
            Finalize Batch
         </button>

      </div>

   );

}