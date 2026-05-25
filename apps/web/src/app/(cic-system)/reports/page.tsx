"use client";

import {
   Download
} from "lucide-react";

import {
   useMemo,
   useState
} from "react";

import {
   useExportReport,
   useImportBatches
} from "@/hooks/cic/useReports";
import { ImportBatchItem } from "@repo/shared";
import { getTimestamp } from "@/utils/date/getTimestamp";
import { formatReportingPeriod } from "@/utils/date/formatReportingPerion";


export default function Reports() {

   const [
      search,
      setSearch
   ] = useState("");

   const {
      data: batches = [],
      isLoading
   } = useImportBatches();

   const {
      mutateAsync: exportReport
   } = useExportReport();

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

   const handleExport =
   async (
      batchId: string,
    
   ) => {

      try {

         const timestamp =
         getTimestamp();

         const blob =
            await exportReport(
               batchId
            );

         const url =
            window.URL.createObjectURL(
               new Blob([blob])
            );

         const link =
            document.createElement("a");

         link.href =
            url;

         link.setAttribute(

            "download",

            `PF007980_CSDF_${timestamp}.txt`

         );

         document.body.appendChild(
            link
         );

         link.click();

         link.remove();

      } catch (error) {

         console.error(error);

      }

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

      </div>

   );

}