"use client";

import { useEffect, useState }
from "react";

import { useRouter }
from "next/navigation";

import {
   UploadCloud,
   FileSpreadsheet,
   Loader2,
   CalendarDays
} from "lucide-react";

import {
   uploadDBF
} from "@/services/cic/batch.service";
import { useReportingPeriods } from "@/hooks/cic/useReports";
import { useLastImport } from "@/hooks/initialize/useInitialize";

export default function UploadDbfModal() {

   const router =
      useRouter();

   const [file, setFile] =
      useState<File | null>(null);

      const {
         data: periods = []
      } = useReportingPeriods();
      
      const [
         reportingPeriodId,
         setReportingPeriodId
      ] = useState("");

   const [loading,
      setLoading] =
      useState(false);

      const selectedReportingPeriodId =
   reportingPeriodId ||
   periods[0]?.id ||
   "";


   
 


   const handleUpload =
   async () => {

      if (!file) {

         alert("Please select a DBF file");

         return;

      }
      if (!selectedReportingPeriodId) {

         alert(
            "Please enter reporting period"
         );
      
         return;
      }

      const formData =
         new FormData();

      formData.append(
         "file",
         file
      );

      formData.append(
         "reportingPeriodId",
         selectedReportingPeriodId
      );

      try {

         setLoading(true);

         const response =
            await uploadDBF(
               formData
            );

         router.push(
            `/cic/batches/${response.batchId}/review`
         );

      } catch (error: unknown) {

         if (error instanceof Error) {

            alert(error.message);

         } else {

            alert("Upload failed");

         }

      } finally {

         setLoading(false);

      }

   };

   return (

      <div className="
         min-h-screen
         bg-slate-50
         p-8
      ">

         <div className="
            max-w-4xl
            mx-auto
         ">

            {/* HEADER */}

            <div className="
               mb-8
            ">

               <h1 className="
                  text-4xl
                  font-bold
                  text-slate-800
                  mb-2
               ">
                  CIC DBF Upload
               </h1>

               <p className="
                  text-slate-500
                  text-lg
               ">
                  Upload and initialize monthly
                  CIC borrower data
               </p>

            </div>

            {/* CARD */}

            <div className="
               bg-white
               rounded-3xl
               shadow-sm
               border
               border-slate-200
               overflow-hidden
            ">

               {/* TOP SECTION */}

               <div className="
                  p-8
                  border-b
                  border-slate-100
               ">

                  <div className="
                     flex
                     items-center
                     gap-3
                     mb-6
                  ">

                     <div className="
                        h-14
                        w-14
                        rounded-2xl
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                     ">

                        <UploadCloud
                           className="
                              text-blue-600
                           "
                           size={28}
                        />

                     </div>

                     <div>

                        <h2 className="
                           text-2xl
                           font-semibold
                           text-slate-800
                        ">
                           Upload DBF File
                        </h2>

                        <p className="
                           text-slate-500
                        ">
                           Supported format:
                           .DBF
                        </p>

                     </div>

                  </div>

                  {/* FILE INPUT */}

                  <div className="
                     mb-6
                  ">

                     <label className="
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        mb-3
                     ">
                        DBF File
                     </label>

                     <label className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        w-full
                        h-48
                        border-2
                        border-dashed
                        border-slate-300
                        rounded-2xl
                        cursor-pointer
                        bg-slate-50
                        hover:bg-slate-100
                        transition
                     ">

                        <div className="
                           flex
                           flex-col
                           items-center
                           justify-center
                        ">

                           <FileSpreadsheet
                              size={50}
                              className="
                                 text-blue-500
                                 mb-4
                              "
                           />

                           <p className="
                              text-slate-700
                              font-medium
                           ">
                              {
                                 file
                                 ? file.name
                                 : "Click to select DBF file"
                              }
                           </p>

                           <p className="
                              text-sm
                              text-slate-400
                              mt-1
                           ">
                              Upload borrower and
                              contract records
                           </p>

                        </div>

                        <input
                           type="file"
                           accept=".dbf"
                           className="hidden"
                           onChange={(e) =>
                              setFile(
                                 e.target.files?.[0]
                                 || null
                              )
                           }
                        />

                     </label>

                  </div>

                {/* REPORTING PERIOD */}

<div
   className="
      mb-8
   "
>

   <label
      className="
         flex
         items-center
         gap-2
         text-sm
         font-medium
         text-slate-700
         mb-3
      "
   >

      <CalendarDays
         size={16}
      />

      Reporting Period

   </label>

   <select

      value={
         reportingPeriodId ||
         periods[0]?.id ||
         ""
      }

      onChange={(e) =>
         setReportingPeriodId(
            e.target.value
         )
      }

      className="
         w-full
         border
         border-slate-300
         rounded-xl
         px-4
         py-3
         outline-none
         focus:ring-2
         focus:ring-blue-500
         focus:border-blue-500
         transition
         bg-white
      "
   >

{
   periods.map((period) => (

      <option
         key={period.id}
         value={period.id}
      >

         {
            new Date(

               period.year,
               period.month - 1

            ).toLocaleString(

               "en-US",

               {
                  month: "long"
               }

            )
         }

         {" "}

         {period.year}

      </option>

   ))
}
   </select>

</div>
                  {/* ACTION BUTTON */}

                  <button

                     onClick={handleUpload}

                     disabled={loading}

                     className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        disabled:bg-blue-300
                        text-white
                        font-semibold
                        py-4
                        rounded-2xl
                        transition
                        flex
                        items-center
                        justify-center
                        gap-3
                        shadow-sm
                     "
                  >

                     {
                        loading
                        ? (
                           <>
                              <Loader2
                                 className="
                                    animate-spin
                                 "
                                 size={20}
                              />

                              Uploading DBF...
                           </>
                        )
                        : (
                           <>
                              <UploadCloud
                                 size={20}
                              />

                              Upload & Initialize
                           </>
                        )
                     }

                  </button>

               </div>

               {/* FOOTER */}

               <div className="
                  px-8
                  py-5
                  bg-slate-50
                  flex
                  items-center
                  justify-between
                  text-sm
                  text-slate-500
               ">

                  <div>
                     CIC Reporting System
                  </div>

                  <div>
                     Secure Financial Upload Workflow
                  </div>

               </div>

            </div>

         </div>

      </div>

   );

}