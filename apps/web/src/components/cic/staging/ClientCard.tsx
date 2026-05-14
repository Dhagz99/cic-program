"use client";

import {
   useState
} from "react";

import ValidationErrors
from "./ValidationErrors";

import EditClientModal
from "./EditClientModal";

type Props = {

   client: any;

   refresh: () => void;

};

export default function ClientCard({
   client,
   refresh
}: Props) {

   const [openModal,
      setOpenModal] =
      useState(false);

   return (

      <div className="
         bg-white
         border
         rounded-2xl
         p-8
         shadow-sm
      ">

         {/*
         -----------------------------------
         HEADER
         -----------------------------------
         */}

         <div className="
            flex
            justify-between
            items-start
         ">

            <div>

               <h2 className="
                  text-3xl
                  font-bold
                  text-gray-800
               ">

                  {client.firstName}
                  {" "}
                  {client.lastName}

               </h2>

               <div className="
                  mt-4
                  space-y-2
                  text-gray-700
               ">

                  <p>

                     <span className="
                        font-semibold
                     ">
                        TIN:
                     </span>

                     {" "}

                     {client.tinNumber || "-"}

                  </p>

                  <p>

                     <span className="
                        font-semibold
                     ">
                        Address:
                     </span>

                     {" "}

                     {client.address}

                  </p>

               </div>

            </div>

            <div>

               <span className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold

                  ${
                     client.validationStatus ===
                     "COMPLETE"

                     ? `
                        bg-green-100
                        text-green-700
                     `

                     : `
                        bg-red-100
                        text-red-700
                     `
                  }
               `}>

                  {client.validationStatus}

               </span>

            </div>

         </div>

         {/*
         -----------------------------------
         VALIDATION ERRORS
         -----------------------------------
         */}

         <ValidationErrors
            errors={client.validationErrors}
         />

         {/*
         -----------------------------------
         ACTIONS
         -----------------------------------
         */}

         <div className="
            mt-6
            flex
            justify-end
         ">

            <button

               onClick={() =>
                  setOpenModal(true)
               }

               className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  font-medium
                  transition
               "
            >
               Edit Client
            </button>

         </div>

         {/*
         -----------------------------------
         MODAL
         -----------------------------------
         */}

         {
            openModal && (

               <EditClientModal

                  client={client}

                  onClose={() =>
                     setOpenModal(false)
                  }

                  onUpdated={refresh}

               />

            )
         }

      </div>

   );

}