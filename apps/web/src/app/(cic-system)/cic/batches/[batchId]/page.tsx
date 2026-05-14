"use client";

import {
   useParams
} from "next/navigation";

import {
   useBatchDetails
} from "@/hooks/cic/useBatchDetails";

import ClientCard
from "@/components/cic/staging/ClientCard";

export default function BatchDetailsPage() {

   const params =
      useParams();

   const batchId =
      params.batchId as string;

   const {
      data,
      isLoading,
      refetch
   } = useBatchDetails(batchId);

   if (isLoading) {

      return <div>Loading...</div>;

   }

   return (

      <div className="
         p-6
         space-y-6
      ">

         <div className="
            flex
            justify-between
            items-center
         ">

            <h1 className="
               text-3xl
               font-bold
            ">
               Batch Details
            </h1>

         </div>

         <div className="
            space-y-6
         ">

            {data?.map((client: any) => (

               <ClientCard

                  key={client.id}

                  client={client}

                  refresh={refetch}

               />

            ))}

         </div>

      </div>

   );

}