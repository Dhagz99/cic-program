"use client";

import {
   Download,
   FileText
} from "lucide-react";

import {
   useMemo,
   useState
} from "react";

import {
   useImportBatches
} from "@/hooks/cic/useReports";
import { ContractExportValidationError, ExportValidationResponse, ImportBatchItem, UpdateLoanFormValues } from "@repo/shared";
import { getTimestamp } from "@/utils/date/getTimestamp";
import { formatReportingPeriod } from "@/utils/date/formatReportingPerion";
import { useExportReport } from "@/hooks/reports/useRepots";
import { CreateReportingPeriodModal } from "@/components/reporting-period/CreateReportingPeriodModal";
import { Button } from "@/components/ui/button";
import { LoanValidationErrorModal } from "@/components/loans/LoanValidationErrorModal";
import EditLoanModal from "@/components/loans/EditLoanModal";
import { useGetLoanById } from "@/hooks/loans/useGetLoanById";
import { useUpdateLoanById } from "@/hooks/loans/useUpdateLoanById";
import { toast } from "sonner";


export default function Reports() {

   const [
      search,
      setSearch
   ] = useState("");

   const {
      data: batches = [],
      isLoading
   } = useImportBatches();

   const [isOpenReporting, setIsOpenReporting] = useState(false);
   const [selectedId, setSelectedId] = useState("");
   const [validationErrors, setValidationErrors] =
       useState<ContractExportValidationError[]>([]);

const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  
   const exportReportMutation = useExportReport();

   const handleEditValidationLoan = (id: string) => {
      setSelectedId(id);
   }

    const {data: loan, isLoading: updateIsLoading} = useGetLoanById(selectedId);

  const updateLoanMutation = useUpdateLoanById();
   /*
   |--------------------------------------------------------------------------
   | FILTER
   |--------------------------------------------------------------------------
   */

   const filteredBatches =
      useMemo(() => {

         return batches.filter(

            (
               item: ImportBatchItem
            ) => {

               const branch =
                  item.branch.branchName
                     .toLowerCase();

                     const period =
                     String(
                        item.reportingPeriod.month
                     ).toLowerCase();

               return (

                  branch.includes(
                     search.toLowerCase()
                  ) ||

                  period.includes(
                     search.toLowerCase()
                  )

               );

            }

         );

      }, [

         batches,
         search

      ]);

   /*
   |--------------------------------------------------------------------------
   | EXPORT
   |--------------------------------------------------------------------------
   */


const handleExport = (batchId: string) => {
  exportReportMutation.mutate(batchId, {
    onError: (error) => {
      const validationError =
        error as ExportValidationResponse;

      console.log(
        "Validation:",
        validationError
      );

      if (
        validationError.validationErrors?.length
      ) {
        setValidationErrors(
          validationError.validationErrors
        );

        setIsValidationModalOpen(true);
      }
    },
  });
};


const handleUpdateLoan = async (
  values: UpdateLoanFormValues
) => {

   try{
      if (!selectedId) return;

      await updateLoanMutation.mutateAsync({
         id: selectedId,
         data: values,
      });
       toast.success("Loan updated successfully.")


  setValidationErrors((prev) => {
    const remaining = prev.filter(
      (item) => item.id !== selectedId
    );

    if (remaining.length === 0) {
      setIsValidationModalOpen(false);
    }
    return remaining;
  });


   }catch(error){
         toast.error(
            error instanceof Error
               ? error.message
               : "Failed to update loan"
         );
   }
  setSelectedId("");
  
};
   if (isLoading) {

      return (

         <div
            className="
               p-6
            "
         >
            Loading...
         </div>

      );

   }

   return (

      <div
         className="
            p-8
          bg-slate-100
            space-y-6
            min-h-screen 
         "
      >

         <div
            className="
               flex
               items-center
               justify-between
            "
         >

            <div>

               <h1
                  className="
                     text-4xl
                     font-bold
                  "
               >
                  CIC Reports
               </h1>

               <p
                  className="
                     text-gray-500
                     mt-1
                  "
               >
                  Generate CIC TXT reports
               </p>

            </div>
            <div className="flex gap-2">
         <input
                        type="text"
                        placeholder="
                           Search reports...
                        "
                        value={search}
                        onChange={(e) =>
                           setSearch(
                              e.target.value
                           )
                        }
                        className="
                           border
                           rounded-2xl
                           px-4
                           py-2
                           w-80
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                        "
            />
               <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={() => setIsOpenReporting(true)}
                  className="min-w-32 shadow-sm"
                  >
                     <FileText data-icon="inline-start" />
                     Open Report
               </Button>
            </div>
           

         </div>

         <div
            className="
               bg-white
               border
               rounded-3xl
               overflow-hidden
            "
         >

            <table
               className="
                  w-full
               "
            >

               <thead
                  className="
                     bg-gray-50
                     border-b
                  "
               >

                  <tr>

                     <th
                        className="
                           px-6
                           py-4
                           text-left
                        "
                     >
                        Branch
                     </th>

                     <th
                        className="
                           px-6
                           py-4
                           text-left
                        "
                     >
                        Reporting Period
                     </th>

                     <th
                        className="
                           px-6
                           py-4
                           text-left
                        "
                     >
                        Records
                     </th>

                     <th
                        className="
                           px-6
                           py-4
                           text-left
                        "
                     >
                        Status
                     </th>

                     <th
                        className="
                           px-6
                           py-4
                           text-right
                        "
                     >
                        Action
                     </th>

                  </tr>

               </thead>

               <tbody>

                  {
                     filteredBatches.map(

                        (
                           batch: ImportBatchItem
                        ) => (

                           <tr
                              key={batch.id}
                              className="
                                 border-b
                              "
                           >

                              <td
                                 className="
                                    px-6
                                    py-4
                                 "
                              >
                                 {batch.branch.branchName}
                              </td>

                              <td
                                 className="
                                    px-6
                                    py-4
                                 "
                              >
                                 {
                                   formatReportingPeriod(Number(batch.reportingPeriod.month), Number(batch.reportingPeriod.year))
                                 }
                              </td>

                              <td
                                 className="
                                    px-6
                                    py-4
                                 "
                              >
                                 {
                                    batch.totalRecords
                                 }
                              </td>

                              <td
                                 className="
                                    px-6
                                    py-4
                                 "
                              >

                                 <span
                                    className="
                                       bg-green-100
                                       text-green-700
                                       px-3
                                       py-1
                                       rounded-full
                                       text-xs
                                       font-medium
                                    "
                                 >
                                    {batch.status}
                                 </span>

                              </td>

                              <td
                                 className="
                                    px-6
                                    py-4
                                    text-right
                                 "
                              >

                                 <button

                                    onClick={() =>
                                       handleExport(
                                          batch.id,
                                        
                                       )
                                    }

                                    className="
                                       inline-flex
                                       items-center
                                       gap-2
                                       bg-blue-600
                                       hover:bg-blue-700
                                       text-white
                                       px-4
                                       py-2
                                       rounded-xl
                                    "
                                 >

                                    <Download
                                       size={16}
                                    />

                                    Export

                                 </button>

                              </td>

                           </tr>

                        )

                     )
                  }

               </tbody>

            </table>

         </div>

         {isOpenReporting && (
            <CreateReportingPeriodModal  isOpen={isOpenReporting} onClose={()=>setIsOpenReporting(false)}/>
         )}

         <LoanValidationErrorModal
            isOpen={isValidationModalOpen}
            errors={validationErrors}
            onClose={() => {
               setIsValidationModalOpen(false);
               setValidationErrors([]);
            }}
            onEditLoan={handleEditValidationLoan}
            />

               {selectedId && !updateIsLoading && (
                      <EditLoanModal
                        isOpen={true}
                        loan={loan ?? null}
                        onClose={() => setSelectedId("")}
                        onSubmit={handleUpdateLoan}
                      />
                    )}

      </div>

   );

}