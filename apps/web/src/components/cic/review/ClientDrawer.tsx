"use client";

import {
   useForm
} from "react-hook-form";

import {
   zodResolver
} from "@hookform/resolvers/zod";


import {
   updateClient
} from "@/services/cic/review.service";
import { StagingClient, UpdateClientDTO, updateClientSchema } from "@repo/shared";

type Props = {

   client: StagingClient;

   onClose: () => void;

   refresh: () => void;

};

export default function ClientDrawer({
   client,
   onClose,
   refresh
}: Props) {

   const {

      register,

      handleSubmit,

      formState: {
         errors,
         isSubmitting
      }

   } = useForm<UpdateClientDTO>({

      resolver:
         zodResolver(
            updateClientSchema
         ),

      defaultValues: {

         firstName:
            client.firstName,

         middleName:
            client.middleName,

         lastName:
            client.lastName,

         gender:
            client.gender || "",

         civilStatus:
            client.civilStatus || "",

         tinNumber:
            client.tinNumber || ""

      }

   });

   const onSubmit =
   async (
      values: UpdateClientDTO
   ) => {

      await updateClient(
         client.id,
         values
      );

      refresh();

      onClose();

   };

   return (

      <div className="
         fixed
         inset-0
         z-50
         bg-black/40
         backdrop-blur-sm
         flex
         justify-end
      ">
   
         {/*
         -----------------------------------
         DRAWER
         -----------------------------------
         */}
   
         <div className="
            h-screen
            w-full
            max-w-2xl
            bg-white
            shadow-2xl
            overflow-y-auto
            flex
            flex-col
         ">
   
            {/*
            -----------------------------------
            HEADER
            -----------------------------------
            */}
   
            <div className="
               sticky
               top-0
               z-10
               bg-white
               border-b
               px-8
               py-6
               flex
               items-center
               justify-between
            ">
   
               <div>
   
                  <h2 className="
                     text-2xl
                     font-bold
                     text-gray-900
                  ">
                     Edit Client
                  </h2>
   
                  <p className="
                     text-sm
                     text-gray-500
                     mt-1
                  ">
                     Update CIC staging data
                  </p>
   
               </div>
   
               <button
   
                  onClick={onClose}
   
                  className="
                     h-10
                     w-10
                     rounded-xl
                     hover:bg-gray-100
                     transition
                     flex
                     items-center
                     justify-center
                     text-xl
                  "
               >
                  ✕
               </button>
   
            </div>
   
            {/*
            -----------------------------------
            FORM
            -----------------------------------
            */}
   
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="
                  flex-1
                  px-8
                  py-6
                  space-y-6
               "
            >
   
               {/*
               -----------------------------------
               CLIENT SUMMARY
               -----------------------------------
               */}
   
               <div className="
                  bg-gray-50
                  border
                  rounded-2xl
                  p-5
               ">
   
                  <div className="
                     flex
                     items-start
                     justify-between
                  ">
   
                     <div>
   
                        <h3 className="
                           text-xl
                           font-bold
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
   
                        </h3>
   
                        <p className="
                           text-sm
                           text-gray-500
                           mt-1
                        ">
   
                           Provider ID:
                           {" "}
                           {
                              client.providerSubjectNo
                           }
   
                        </p>
   
                     </div>
   
                     <div>
   
                        {
   
                           client.validationStatus
                           === "COMPLETE"
   
                           ? (
   
                              <span className="
                                 bg-green-100
                                 text-green-700
                                 text-xs
                                 font-semibold
                                 px-3
                                 py-1
                                 rounded-full
                              ">
                                 COMPLETE
                              </span>
   
                           )
   
                           : (
   
                              <span className="
                                 bg-red-100
                                 text-red-700
                                 text-xs
                                 font-semibold
                                 px-3
                                 py-1
                                 rounded-full
                              ">
                                 WITH ERRORS
                              </span>
   
                           )
   
                        }
   
                     </div>
   
                  </div>
   
               </div>
   
               {/*
               -----------------------------------
               FORM GRID
               -----------------------------------
               */}
   
               <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
               ">
   
                  {/*
                  FIRST NAME
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        First Name
                     </label>
   
                     <input
   
                        {...register(
                           "firstName"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     />
   
                  </div>
   
                  {/*
                  MIDDLE NAME
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        Middle Name
                     </label>
   
                     <input
   
                        {...register(
                           "middleName"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     />
   
                  </div>
   
                  {/*
                  LAST NAME
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        Last Name
                     </label>
   
                     <input
   
                        {...register(
                           "lastName"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     />
   
                  </div>
   
                  {/*
                  SUFFIX
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        Suffix
                     </label>
   
                 
   
                  </div>
   
                  {/*
                  GENDER
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        Gender
                     </label>
   
                     <select
   
                        {...register(
                           "gender"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     >
   
                        <option value="">
                           Select Gender
                        </option>
   
                        <option value="M">
                           Male
                        </option>
   
                        <option value="F">
                           Female
                        </option>
   
                     </select>
   
                  </div>
   
                  {/*
                  CIVIL STATUS
                  */}
   
                  <div className="
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        Civil Status
                     </label>
   
                     <select
   
                        {...register(
                           "civilStatus"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     >
   
                        <option value="">
                           Select Status
                        </option>
   
                        <option value="SINGLE">
                           Single
                        </option>
   
                        <option value="MARRIED">
                           Married
                        </option>
   
                        <option value="WIDOWED">
                           Widowed
                        </option>
   
                     </select>
   
                  </div>
   
                  {/*
                  TIN
                  */}
   
                  <div className="
                     md:col-span-2
                     space-y-2
                  ">
   
                     <label className="
                        text-sm
                        font-medium
                        text-gray-700
                     ">
                        TIN Number
                     </label>
   
                     <input
   
                        {...register(
                           "tinNumber"
                        )}
   
                        className="
                           w-full
                           border
                           rounded-xl
                           px-4
                           py-3
                           outline-none
                           focus:ring-2
                           focus:ring-blue-500
                           focus:border-blue-500
                        "
                     />
   
                  </div>
   
               </div>
   
            </form>
   
            {/*
            -----------------------------------
            FOOTER
            -----------------------------------
            */}
   
            <div className="
               sticky
               bottom-0
               bg-white
               border-t
               px-8
               py-5
               flex
               justify-end
               gap-3
            ">
   
               <button
   
                  type="button"
   
                  onClick={onClose}
   
                  className="
                     px-5
                     py-3
                     rounded-xl
                     border
                     hover:bg-gray-100
                     transition
                  "
               >
                  Cancel
               </button>
   
               <button
   
                  type="submit"
   
                  onClick={handleSubmit(onSubmit)}
   
                  className="
                     bg-blue-600
                     hover:bg-blue-700
                     transition
                     text-white
                     px-6
                     py-3
                     rounded-xl
                     font-medium
                     shadow-sm
                  "
               >
                  Save Changes
               </button>
   
            </div>
   
         </div>
   
      </div>
   
   );

}