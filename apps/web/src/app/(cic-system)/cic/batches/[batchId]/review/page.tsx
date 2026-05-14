"use client";

import {
   useParams
} from "next/navigation";

import {
   useBatchReview
} from "@/hooks/cic/useBatchReview";

import ClientTable
from "@/components/cic/review/ClientTable";

export default function ReviewPage() {

   const params =
      useParams();

   const batchId =
      params.batchId as string;

   const {

      data,

      isLoading,

      refetch

   } = useBatchReview(batchId);

   console.log("data: ", data )

   if (isLoading) {

      return <div>Loading...</div>;

   }

   return (

      <div className="
         p-6
         space-y-6
      ">

      
         <ClientTable

            clients={data || []}

            refresh={refetch}

         />

      </div>

   );

}