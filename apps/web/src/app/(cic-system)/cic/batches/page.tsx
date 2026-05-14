"use client";

import Link from "next/link";

import {
   useBatches
} from "@/hooks/cic/useBatches";

import BatchStatusBadge
from "@/components/cic/shared/BatchStatusBadge";

export default function BatchesPage() {

   const {
      data,
      isLoading
   } = useBatches();

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
            CIC Batches
         </h1>

         <table className="
            w-full
            border
         ">

            <thead>

               <tr className="
                  bg-gray-100
               ">

                  <th className="border p-3">
                     File
                  </th>

                  <th className="border p-3">
                     Status
                  </th>

                  <th className="border p-3">
                     Errors
                  </th>

                  <th className="border p-3">
                     Action
                  </th>

               </tr>

            </thead>

            <tbody>

               {data?.map((batch: any) => (

                  <tr key={batch.id}>

                     <td className="border p-3">
                        {batch.fileName}
                     </td>

                     <td className="border p-3">

                        <BatchStatusBadge
                           status={batch.status}
                        />

                     </td>

                     <td className="border p-3">
                        {batch.errorRecords}
                     </td>

                     <td className="border p-3">

                        <Link
                           href={`/cic/batches/${batch.id}`}
                           className="
                              bg-blue-600
                              text-white
                              px-3
                              py-2
                              rounded
                           "
                        >
                           Open
                        </Link>

                     </td>

                  </tr>

               ))}

            </tbody>

         </table>

      </div>

   );

}