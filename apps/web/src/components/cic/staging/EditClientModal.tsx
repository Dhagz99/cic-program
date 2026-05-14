"use client";

import {
   useState
} from "react";

import {
   updateStagingClient
} from "@/services/cic/staging.service";

type Props = {

   client: any;

   onClose: () => void;

   onUpdated: () => void;

};

export default function EditClientModal({
   client,
   onClose,
   onUpdated
}: Props) {

   const [form, setForm] =
      useState({

         firstName:
            client.firstName || "",

         middleName:
            client.middleName || "",

         lastName:
            client.lastName || "",

         gender:
            client.gender || "",

         civilStatus:
            client.civilStatus || "",

         tinNumber:
            client.tinNumber || ""

      });

   const [loading, setLoading] =
      useState(false);

   const handleSave =
   async () => {

      try {

         setLoading(true);

         await updateStagingClient(
            client.id,
            form
         );

         onUpdated();

         onClose();

      } catch {

         alert("Update failed");

      } finally {

         setLoading(false);

      }

   };

   return (

      <div className="
         fixed
         inset-0
         bg-black/40
         flex
         items-center
         justify-center
         z-50
      ">

         <div className="
            bg-white
            rounded-2xl
            p-6
            w-full
            max-w-xl
            space-y-4
         ">

            <h2 className="
               text-2xl
               font-bold
            ">
               Edit Client
            </h2>

            <input
               value={form.firstName}
               onChange={(e) =>
                  setForm({
                     ...form,
                     firstName: e.target.value
                  })
               }
               placeholder="First Name"
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
               "
            />

            <input
               value={form.middleName}
               onChange={(e) =>
                  setForm({
                     ...form,
                     middleName: e.target.value
                  })
               }
               placeholder="Middle Name"
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
               "
            />

            <input
               value={form.lastName}
               onChange={(e) =>
                  setForm({
                     ...form,
                     lastName: e.target.value
                  })
               }
               placeholder="Last Name"
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
               "
            />

            <select
               value={form.gender}
               onChange={(e) =>
                  setForm({
                     ...form,
                     gender: e.target.value
                  })
               }
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
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

            <select
               value={form.civilStatus}
               onChange={(e) =>
                  setForm({
                     ...form,
                     civilStatus: e.target.value
                  })
               }
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
               "
            >

               <option value="">
                  Select Civil Status
               </option>

               <option value="SINGLE">
                  SINGLE
               </option>

               <option value="MARRIED">
                  MARRIED
               </option>

               <option value="WIDOWED">
                  WIDOWED
               </option>

            </select>

            <input
               value={form.tinNumber}
               onChange={(e) =>
                  setForm({
                     ...form,
                     tinNumber: e.target.value
                  })
               }
               placeholder="TIN Number"
               className="
                  border
                  p-3
                  w-full
                  rounded-lg
               "
            />

            <div className="
               flex
               justify-end
               gap-2
               pt-4
            ">

               <button
                  onClick={onClose}
                  className="
                     border
                     px-4
                     py-2
                     rounded-lg
                  "
               >
                  Cancel
               </button>

               <button
                  onClick={handleSave}
                  disabled={loading}
                  className="
                     bg-blue-600
                     text-white
                     px-4
                     py-2
                     rounded-lg
                  "
               >
                  {
                     loading
                     ? "Saving..."
                     : "Save"
                  }
               </button>

            </div>

         </div>

      </div>

   );

}