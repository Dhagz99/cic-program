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
import { StagingClient } from "@repo/shared";
import ValidationBadge from "./ValidationBandge";
import ErrorCountBadge from "./ErrorCountBandge";
import ClientDrawer from "./ClientDrawer";




type Props = {

   clients: StagingClient[];

   refresh: () => void;

};

const columnHelper =
   createColumnHelper<StagingClient>();

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
      useState<StagingClient | null>(
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
                     client.firstName,
                     client.middleName,
                     client.lastName,
                     client.suffix
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
                              client.firstName,
                              client.middleName,
                              client.lastName,
                              client.suffix
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
                           client.providerSubjectNo
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

         columnHelper.accessor(
            "tinNumber",
            {

               header: "TIN",

               cell: (info) => (

                  <span className="
                     text-sm
                  ">

                     {
                        info.getValue()
                        || "-"
                     }

                  </span>

               )

            }
         ),

         /*
         -----------------------------------
         GENDER
         -----------------------------------
         */

         columnHelper.accessor(
            "gender",
            {

               header: "Gender",

               cell: (info) => (

                  <span>

                     {
                        info.getValue()
                        || "-"
                     }

                  </span>

               )

            }
         ),

         /*
         -----------------------------------
         STATUS
         -----------------------------------
         */

         columnHelper.accessor(
            "validationStatus",
            {

               header: "Status",

               cell: (info) => (

                  <ValidationBadge
                     status={
                        info.getValue()
                     }
                  />

               )

            }
         ),

         /*
         -----------------------------------
         ERRORS
         -----------------------------------
         */

         columnHelper.accessor(
            "validationErrors",
            {

               header: "Errors",

               cell: (info) => (

                  <ErrorCountBadge

                     count={
                        info
                        .getValue()
                        .length
                     }

                  />

               )

            }
         ),

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
                        w-[300px]
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

                              client
                              .validationStatus
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

                              client
                              .validationStatus
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
                  max-h-[700px]
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

                                       row.original
                                       .validationStatus
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

                  client={
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