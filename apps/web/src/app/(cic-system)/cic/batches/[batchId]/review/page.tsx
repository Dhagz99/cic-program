"use client";

import {
   useParams,
   useRouter
} from "next/navigation";

import {
   useBatchReview
} from "@/hooks/cic/useBatchReview";

import ClientTable
from "@/components/cic/review/ClientTable";
import { useFinalizeBatch } from "@/hooks/cic/useFinalizeBatch";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function ReviewPage() {

   const params =
      useParams();
   const router =
      useRouter();
   const batchId =
      params.batchId as string;

   const {

      data,

      isLoading,

      refetch

   } = useBatchReview(batchId);


   const {

      mutateAsync:
         finalizeBatch,

      isPending:
         isFinalizing

   } = useFinalizeBatch();


   const handleFinalize =
   async () => {

      try {

         await finalizeBatch(
            batchId
         );

         toast.success(
            "Batch finalized successfully"
         );

         router.push(
            "/reports"
         );

      } catch (error) {

         console.error(error);

         toast.error(
            "Failed to finalize batch"
         );

      }

   };


   console.log("data: ", data )

   if (isLoading) {

      return <div>Loading...</div>;

   }

   return (

      <div className="
         p-6
         space-y-6
      ">

         {/* FINALIZE BUTTON */}

         <button

onClick={
   handleFinalize
}

disabled={
   isFinalizing
}

className="
   inline-flex
   items-center
   gap-2
   bg-green-600
   hover:bg-green-700
   disabled:opacity-50
   text-white
   px-5
   py-3
   rounded-2xl
   font-medium
   transition
"
>

<CheckCircle2
   size={18}
/>

{
   isFinalizing

      ? "Finalizing..."

      : "Finalize Batch"
}

</button>
         <ClientTable

            clients={data || []}

            refresh={refetch}

         />

      </div>

   );

}