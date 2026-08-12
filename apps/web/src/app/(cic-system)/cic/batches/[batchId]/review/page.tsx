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
import { ArrowLeft, CheckCircle2, Trash2Icon } from "lucide-react";
import { useSubmitBatch } from "@/hooks/cic/useSubmitBatch";
import axios from "axios";
import { useAuth } from "@/components/context/UserContext";
import { useGetBatchById } from "@/hooks/cic/batch/useGetBatch";
import { useDeleteBatch } from "@/hooks/cic/batch/useDeleteBatch";
import SweetAlert from "@/components/Swal";

export default function ReviewPage() {


   const {hasPermission} = useAuth();


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

   const {data: batchDetails} = useGetBatchById(batchId);

   const {
      mutate: deleteBatch,
      isPending
   } = useDeleteBatch();

   const handleDeleteBatch = () => {
      SweetAlert.confirmationAlert(
         "Are you sure?", 
         "Do you want to delete this batch?",
         ()=>{
            deleteBatch(batchId, {
                  onSuccess: (data) => {
                     toast.success(
                        data.message
                     );
                     router.push("/cic/upload");
                  },
                  onError: (error) => {
                     console.error(error);
                  },
               });
         }
      );
  
   };

   


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
   
         router.push("/cic/upload");
   
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

      <div className=" p-6 space-y-6  ">

<div className="flex items-center justify-between">
  <button
    onClick={() => router.push("/cic/upload")}
    className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      rounded-xl
      border
      border-slate-300
      bg-white
      text-slate-700
      hover:bg-slate-100
      transition
    "
  >
    <ArrowLeft size={18} />
    Back to Initialize
  </button>

  <div className="flex items-center gap-3">
    {hasPermission("STAGING_FINALIZE")  && (batchDetails?.status == "FOR_REVIEW") &&  (
      <button
        onClick={handleFinalize}
        disabled={isFinalizing}
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
        <CheckCircle2 size={18} />
        {isFinalizing ? "Finalizing..." : "Finalize Batch"}
      </button>
    )}

    {hasPermission("STAGING_SUBMIT")  && (batchDetails?.status == "PENDING_COMPLETION") && (
      <div className="flex gap-2">
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
               <CheckCircle2 size={20} />
               {isSubmitting ? "Submitting..." : "Submit Batch"}
         </button>
         <button
            onClick={handleDeleteBatch}
            disabled={isPending}
            className="
               inline-flex
               items-center
               gap-2
               bg-red-400
               hover:bg-red-500
               disabled:opacity-50
               text-white
               px-5
               py-3
               rounded-2xl
               font-medium
               transition
            "
            >
            <Trash2Icon size={20} />
            {isPending ? "Deleting..." : "Delete Batch"}
         </button>
      </div>
     
      
    )}
  </div>
</div>

    
         <ClientTable

            clients={data || []}

            refresh={refetch}

         />

      </div>

   );

}