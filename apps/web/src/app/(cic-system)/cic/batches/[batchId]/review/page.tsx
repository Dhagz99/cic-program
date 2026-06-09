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
import { useSubmitBatch } from "@/hooks/cic/useSubmitBatch";
import axios from "axios";

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


   const {
      mutateAsync: submitBatch,
      isPending: isSubmitting,
   } = useSubmitBatch();
   
   const handleSubmit = async () => {
      try {
         await submitBatch(batchId);
   
         toast.success(
            "Batch submitted successfully"
         );
   
         router.push("/reports");
   
      } catch (error: unknown) {
   
         if (axios.isAxiosError(error)) {
   
            toast.error(
               error.response?.data?.message ??
               "Failed to submit batch",
               {
                  duration: 5000,
                  className: "!border-red-200",
               }
            );
   
            return;
         }
   
         toast.error(
            "An unexpected error occurred"
         );
      }
   };
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

   <button
         onClick={handleSubmit}
         disabled={isSubmitting}
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
         <CheckCircle2 size={18}/>
         {isSubmitting
            ? "Submitting..."
            : "Submit Batch"}
      </button>
         <ClientTable

            clients={data || []}

            refresh={refetch}

         />

      </div>

   );

}