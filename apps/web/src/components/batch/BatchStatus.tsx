import { BatchStatus } from "@repo/shared";

export const batchStatusConfig: Record<
   BatchStatus,
   {
      label: string;
      className: string;
   }
> = {
   PROCESSING: {
      label: "Processing",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
   },

   PENDING_COMPLETION: {
      label: "Pending Completion",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
   },

   FOR_REVIEW: {
      label: "For Review",
      className: "bg-violet-100 text-violet-700 border border-violet-200",
   },

   FINALIZED: {
      label: "Finalized",
      className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
   },

   APPROVED: {
      label: "Approved",
      className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
   },

   RETURNED: {
      label: "Returned",
      className: "bg-orange-100 text-orange-700 border border-orange-200",
   },

   REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border border-red-200",
   },
};