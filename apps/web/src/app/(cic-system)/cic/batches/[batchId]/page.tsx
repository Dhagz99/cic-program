"use client";

import { useParams }
from "next/navigation";

import {
   useBatchDetails
} from "@/hooks/cic/useBatchDetails";

import BatchStatusBadge
from "@/components/cic/shared/BatchStatusBadge";

export default function BatchDetailsPage() {

   const params =
      useParams();

   const batchId =
      params.batchId as string;

   const {
      data,
      isLoading
   } = useBatchDetails(
      batchId
   );

   if (isLoading) {

      return <div>Loading...</div>;

   }

   return (

      <div className="p-6">

         <h1 className="
            text-2xl
            font-bold
            mb-6
         ">
            Batch Details
         </h1>

         <div className="
            space-y-6
         ">

            {data?.map((client: any) => (

               <div
                  key={client.id}
                  className="
                     border
                     rounded
                     p-4
                  "
               >

                  <div className="
                     flex
                     justify-between
                     mb-4
                  ">

                     <h2 className="
                        font-bold
                     ">
                        {client.firstName}
                        {" "}
                        {client.lastName}
                     </h2>

                     <BatchStatusBadge
                        status={
                           client.validationStatus
                        }
                     />

                  </div>

                  <div className="
                     mb-4
                  ">

                     <p>
                        TIN:
                        {" "}
                        {client.tinNumber}
                     </p>

                     <p>
                        Address:
                        {" "}
                        {client.address}
                     </p>

                  </div>

                  {
                     client.validationErrors
                     ?.length > 0 && (

                        <div className="
                           bg-red-100
                           p-3
                           rounded
                           mb-4
                        ">

                           {
                              client.validationErrors
                              .map((error: any) => (

                                 <div
                                    key={error.id}
                                 >
                                    {error.errorMessage}
                                 </div>

                              ))
                           }

                        </div>

                     )
                  }

               </div>

            ))}

         </div>

      </div>

   );

}