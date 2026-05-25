"use client";

import {
   useMemo,
   useState
}
from "react";

import {

   createColumnHelper,

   flexRender,

   getCoreRowModel,

   useReactTable

}
from "@tanstack/react-table";
import ValidationBadge from "./ValidationBandge";
import ErrorCountBadge from "./ErrorCountBandge";
import ClientDrawer from "./ClientDrawer";
import { ReviewClient } from "@/types/review.types";




type Props = {

   clients: ReviewClient[];

   refresh: () => void;

};

const columnHelper =
   createColumnHelper<ReviewClient>();

export default function ClientTable({
   clients,
   refresh
}: Props) {

   /*
   -----------------------------------
   STATE
   -----------------------------------
   */

   const [selectedClient,
      setSelectedClient] =
      useState<ReviewClient | null>(
         null
      );

   const [search,
      setSearch] =
      useState("");

   /*
   -----------------------------------
   FILTERED CLIENTS
   -----------------------------------
   */

   const filteredClients =
      useMemo(() => {

         if (!search) {

            return clients;

         }

         return clients.filter(
            (client) => {

               const fullName =

                  [
                     client.mergedPreview.firstName,
                     client.mergedPreview.middleName,
                     client.mergedPreview.lastName,
                     client.mergedPreview.suffix
                  ]

                  .filter(Boolean)

                  .join(" ")

                  .toLowerCase();

               return fullName.includes(
                  search.toLowerCase()
               );

            }
         );

      }, [

         clients,
         search

      ]);

   /*
   -----------------------------------
   COLUMNS
   -----------------------------------
   */

   const columns =
      useMemo(() => [

         /*
         -----------------------------------
         NAME
         -----------------------------------
         */

         columnHelper.display({

            id: "fullName",

            header: "Name",

            cell: ({ row }) => {

               const client =
                  row.original;

               return (

                  <div className="
                     flex
                     flex-col
                  ">

                     <span className="
                        font-semibold
                        text-gray-900
                     ">

                        {

                           [
                              client.mergedPreview.firstName,
                              client.mergedPreview.middleName,
                              client.mergedPreview.lastName,
                              client.mergedPreview.suffix
                           ]

                           .filter(Boolean)

                           .join(" ")

                        }

                     </span>

                     <span className="
                        text-xs
                        text-gray-500
                     ">

                        ID:
                        {" "}
                        {
                           client.stagingClient.providerSubjectNo
                        }

                     </span>

                  </div>

               );

            }

         }),

         /*
         -----------------------------------
         TIN
         -----------------------------------
         */

        

         /*
         -----------------------------------
         GENDER
         -----------------------------------
         */

      /*
-----------------------------------
GENDER
-----------------------------------
*/

columnHelper.display({

   id: "gender",

   header: "Gender",

   cell: ({ row }) => {

      const item =
         row.original;

      /*
      -----------------------------------
      UPLOADED GENDER
      -----------------------------------
      */

      const uploadedGender =
         item.stagingClient.gender;

      /*
      -----------------------------------
      FINAL GENDER
      -----------------------------------
      */

      const finalGender =
         item.mergedPreview.genderCode;

      return (

         <div className="
            flex
            flex-col
            gap-1
         ">

            {/* UPLOADED */}

            <span className="
               text-xs
               text-gray-500
            ">

               Uploaded:
               {" "}

               {
                  uploadedGender?.description || "-"
               }

            </span>

            {/* FINAL */}

            <span
               className={`
                  inline-flex
                  items-center
                  justify-center
                  px-2
                  py-1
                  rounded-md
                  text-xs
                  font-medium
                  w-fit

                  ${
                     finalGender === "M"

                        ? `
                           bg-blue-100
                           text-blue-700
                        `

                        : finalGender === "F"

                        ? `
                           bg-pink-100
                           text-pink-700
                        `

                        : `
                           bg-gray-100
                           text-gray-700
                        `
                  }
               `}
            >

               {
                  finalGender === "M"

                     ? "Male"

                     : finalGender === "F"

                     ? "Female"

                     : "-"
               }

            </span>

            {/* USED EXISTING */}

            {
               item.comparison.genderMissing && (

                  <span className="
                     text-xs
                     text-green-700
                     bg-green-100
                     px-2
                     py-1
                     rounded-md
                     w-fit
                  ">

                     Used Existing

                  </span>

               )
            }

         </div>

      );

   }

}),     
       /*
         -----------------------------------
         STATUS
         -----------------------------------
         */

         columnHelper.display({

            id: "status",
         
            header: "Status",
         
            cell: ({ row }) => (
         
               <ValidationBadge
         
                  status={
                     row.original
                        .effectiveValidationStatus
                  }
         
               />
         
            )
         
         }),

         /*
         -----------------------------------
         ERRORS
         -----------------------------------
         */

         columnHelper.display({

            id: "errors",
         
            header: "Errors",
         
            cell: ({ row }) => (
         
               <ErrorCountBadge
         
                  count={
                     row.original
                        .effectiveValidationErrors
                        .length
                  }
         
               />
         
            )
         
         }),

         /*
         -----------------------------------
         ACTIONS
         -----------------------------------
         */

         columnHelper.display({

            id: "actions",

            header: "Actions",

            cell: ({ row }) => (

               <button

                  onClick={() =>
                     setSelectedClient(
                        row.original
                     )
                  }

                  className="
                     bg-blue-600
                     hover:bg-blue-700
                     transition
                     text-white
                     px-4
                     py-2
                     rounded-xl
                     text-sm
                     font-medium
                  "
               >
                  Review
               </button>

            )

         })

      ], []);

   /*
   -----------------------------------
   TABLE
   -----------------------------------
   */

   const table =
      useReactTable({

         data:
            filteredClients,

         columns,

         getCoreRowModel:
            getCoreRowModel()

      });

   /*
   -----------------------------------
   UI
   -----------------------------------
   */

   return (

      <>

         <div className="
            space-y-6
         ">

            {/*
            -----------------------------------
            TOP ACTIONS
            -----------------------------------
            */}

            <div className="
               flex
               flex-col
               md:flex-row
               md:items-center
               md:justify-between
               gap-4
            ">

               <div>

                  <h2 className="
                     text-2xl
                     font-bold
                  ">
                     Client Review
                  </h2>

                  <p className="
                     text-gray-500
                     text-sm
                     mt-1
                  ">
                     Review and correct
                     CIC staging records
                  </p>

               </div>

               

               <div className="
                  flex
                  items-center
                  gap-3
               ">

                  <input

                     value={search}

                     onChange={(e) =>
                        setSearch(
                           e.target.value
                        )
                     }

                     placeholder="
                        Search client...
                     "

                     className="
                        border
                        rounded-xl
                        px-4
                        py-2
                        w-75
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                     "
                  />

               </div>

            </div>

            {/*
            -----------------------------------
            SUMMARY CARDS
            -----------------------------------
            */}

            <div className="
               grid
               grid-cols-1
               md:grid-cols-3
               gap-4
            ">

               <div className="
                  bg-white
                  rounded-2xl
                  border
                  p-5
               ">

                  <p className="
                     text-sm
                     text-gray-500
                  ">
                     Total Clients
                  </p>

                  <h3 className="
                     text-3xl
                     font-bold
                     mt-2
                  ">
                     {
                        clients.length
                     }
                  </h3>

               </div>

               <div className="
                  bg-red-50
                  rounded-2xl
                  border
                  border-red-100
                  p-5
               ">

                  <p className="
                     text-sm
                     text-red-500
                  ">
                     With Errors
                  </p>

                  <h3 className="
                     text-3xl
                     font-bold
                     text-red-600
                     mt-2
                  ">

                     {

                        clients.filter(
                           (client) =>

                              client.effectiveValidationStatus
                              === "WITH_ERRORS"

                        ).length

                     }

                  </h3>

               </div>

               <div className="
                  bg-green-50
                  rounded-2xl
                  border
                  border-green-100
                  p-5
               ">

                  <p className="
                     text-sm
                     text-green-500
                  ">
                     Complete
                  </p>

                  <h3 className="
                     text-3xl
                     font-bold
                     text-green-600
                     mt-2
                  ">

                     {

                        clients.filter(
                           (client) =>

                              client.effectiveValidationStatus
                              === "COMPLETE"

                        ).length

                     }

                  </h3>

               </div>

            </div>

            {/*
            -----------------------------------
            TABLE
            -----------------------------------
            */}

            <div className="
               bg-white
               rounded-2xl
               border
               overflow-hidden
               shadow-sm
            ">

               <div className="
                  overflow-auto
                  max-h-175
               ">

                  <table className="
                     w-full
                     text-sm
                  ">

                     <thead className="
                        sticky
                        top-0
                        bg-gray-50
                        z-10
                     ">

                        {

                           table
                           .getHeaderGroups()
                           .map((headerGroup) => (

                              <tr
                                 key={
                                    headerGroup.id
                                 }
                              >

                                 {

                                    headerGroup
                                    .headers
                                    .map((header) => (

                                       <th

                                          key={
                                             header.id
                                          }

                                          className="
                                             text-left
                                             px-6
                                             py-4
                                             font-semibold
                                             text-gray-700
                                             border-b
                                          "
                                       >

                                          {

                                             flexRender(

                                                header
                                                .column
                                                .columnDef
                                                .header,

                                                header.getContext()

                                             )

                                          }

                                       </th>

                                    ))

                                 }

                              </tr>

                           ))

                        }

                     </thead>

                     <tbody>

                        {

                           table
                           .getRowModel()
                           .rows
                           .map((row) => (
                              <tr
                                 key={row.id}
                                 className={`
                                    border-b
                                    hover:bg-gray-50
                                    transition
                                    ${
                                       row.original.effectiveValidationStatus
                                       === "WITH_ERRORS"

                                       ? "bg-red-50/20"

                                       : ""

                                    }

                                 `}
                              >
                                 {

                                    row
                                    .getVisibleCells()
                                    .map((cell) => (
                                       <td
                                          key={cell.id}

                                          className="
                                             px-6
                                             py-5
                                             align-top
                                          "
                                       >

                                          {

                                             flexRender(

                                                cell
                                                .column
                                                .columnDef
                                                .cell,

                                                cell.getContext()

                                             )

                                          }

                                       </td>

                                    ))

                                 }

                              </tr>

                           ))

                        }

                     </tbody>

                  </table>

               </div>

            </div>

         </div>

         {/*
         -----------------------------------
         DRAWER
         -----------------------------------
         */}

{
   selectedClient && (

      <ClientDrawer

         reviewClient={
            selectedClient
         }

         refresh={refresh}

         onClose={() =>
            setSelectedClient(null)
         }

      />

   )
}

      </>

   );

}