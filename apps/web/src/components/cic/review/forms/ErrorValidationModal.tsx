"use client";

import { ReviewClient } from "@/types/review.types";
import { XCircle } from "lucide-react";


type Props = {
   open: boolean;
   onClose: () => void;
   reviewClient: ReviewClient;
};

export default function ErrorValidationModal({
   open,
   onClose,
   reviewClient,
}: Props) {
   if (!open) return null;

   const client =
      reviewClient.stagingClient;

   const errors =
      reviewClient.effectiveValidationErrors.length > 0
         ? reviewClient.effectiveValidationErrors
         : client.validationErrors;

   const fullName = [
      client.firstName,
      client.middleName,
      client.lastName,
      client.suffix,
   ]
      .filter(Boolean)
      .join(" ");

   return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
         <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
               <div>
                  <h2 className="text-base font-semibold text-slate-900">
                     Validation Errors
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                     {fullName || "Unnamed Client"}
                  </p>
               </div>

               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
               >
                  ✕
               </button>
            </div>

            <div className="max-h-105 space-y-3 overflow-y-auto px-6 py-5">
               {errors.length > 0 ? (
                  errors.map((error, index) => (
                     <div
                        key={`${error.fieldName}-${index}`}
                        className="flex gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3"
                     >
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                        <div>
                           <p className="text-sm font-medium text-red-700">
                              {error.errorMessage}
                           </p>

                           <p className="mt-1 text-xs text-red-500">
                              Field: {error.fieldName}
                           </p>
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-sm text-slate-500">
                     No validation errors found.
                  </p>
               )}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
               >
                  Close
               </button>
            </div>
         </div>
      </div>
   );
}