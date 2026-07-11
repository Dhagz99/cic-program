"use client";

import AddBorrowerModal from "@/components/clients/AddBorrowerModal";
import ClientViewModal from "@/components/clients/ClientViewModal";
import EditClientModal from "@/components/clients/EditClientModal";
import RequestModal from "@/components/Modal";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useCivilStatusDomain, useGenderDomain, useIdentificationTypeDomain } from "@/hooks/cic/useDomain";
import { useClients, useUpdateClient } from "@/hooks/clients/useClients";
import { useUploadDailyClient } from "@/hooks/clients/useUploadDailyClient";
import { useDomains } from "@/hooks/useGeneral";
import api from "@/lib/axios";
import { StagingClient, UpdateClientFormValues } from "@repo/shared";
import {
   BadgeCheck,
   Download,
   Eye,
   FileText,
   Filter,
   Pencil,
   Plus,
   Search,
   Trash2,
   Users,
   Wallet,
} from "lucide-react";

import { useState } from "react";



export default function Borrowers() {

   const [page, setPage] =
      useState(1);

   const [limit, setLimit] =
      useState(10);

   const [search, setSearch] =
      useState("");

   const [genderCode, setGenderCode] =
      useState("");
   
   const [viewClient, setViewClient] = useState<StagingClient | null >(null);

   const [isOpenAddBorrower, setIsOpenAddBorrower] = useState(false);

   const uploadDailyClient = useUploadDailyClient();

   /*
      |--------------------------------------------------------------------------
      | DOMAINS
      |--------------------------------------------------------------------------
      */
   
      const {
         data: genders
      } = useGenderDomain();
   
      const {
         data: civilStatuses
      } = useCivilStatusDomain();
   
      const {
         data: identificationTypes
      } = useIdentificationTypeDomain();

         const {data: contact_type} = useDomains("CONTACT_TYPE")

   const handleUpload = async (
      file: File
    ) => {
      await uploadDailyClient.mutateAsync(file);
  
      setIsOpenAddBorrower(false);
    };

    const updateClientMutation = useUpdateClient();

      const handleUpdateClient = async (
         values: UpdateClientFormValues
      ) => {
         if (!editClient) {
         throw new Error(
            "No client was selected."
         );
         }
      
         await updateClientMutation.mutateAsync({
         id: editClient.id,
         data: values
         });
      };

  
      const toEditFormValues = (
         client: StagingClient & {
           secondaryIdentificationTypeCode?: number | string | null;
         }
       ): UpdateClientFormValues => {
         const secondaryCode =
           client.secondaryIdentificationType?.code ??
           client.secondaryIdentificationTypeCode ??
           "";
       
         const values: UpdateClientFormValues = {
           firstName: client.firstName ?? "",
           middleName: client.middleName ?? "",
           lastName: client.lastName ?? "",
           suffix: client.suffix ?? "",
       
           gender: String(client.gender?.code ?? ""),
       
           birthDate: client.birthDate
             ? String(client.birthDate).slice(0, 10)
             : "",
       
           placeOfBirth: client.placeOfBirth ?? "",
       
           civilStatus: String(
             client.civilStatus?.code ?? ""
           ),
       
           numberOfDependents: Number(
             client.numberOfDependents ?? 0
           ),
       
           addressType: client.addressType ?? "MI",
           address: client.address ?? "",
       
           addressType2: client.addressType2 ?? "AI",
           address2: client.address2 ?? "",
       
           identificationType: String(
             client.identificationType?.code ?? ""
           ),
       
           identificationNumber:
             client.identificationNumber ?? "",
       
           secondaryIdentificationType:
             String(secondaryCode),
       
           secondaryIdentificationNumber:
             client.secondaryIdentificationNumber ?? "",
       
           contactType: String(
             client.contactType ?? ""
           ),
       
           contactValue:
             client.contactValue ?? ""
         };
       
      
       
         return values;
       };

const [editClient, setEditClient] =
  useState<StagingClient | null>(null);


  console.log("selected Client: ", editClient)


   const {
      clients,
      pagination,
      total,
      isLoading,
      totalBorrowers,
      totalContracts,
      totalFinancedAmount,
      totalOutstandingBalance
   } = useClients({
      page,
      limit,
      search,
      genderCode,
   });

   return (

      <div className="
         p-8
         bg-slate-100
         min-h-screen 
         flex
         flex-col
         gap-7
      ">

         {/* HEADER */}

         <div className="
            flex
            items-center
            justify-between
         ">

            <div>

               <h1 className="
                  text-3xl
                  font-bold
                  text-slate-800
               ">
                  Borrowers
               </h1>

               <p className="
                  text-slate-500
                  mt-1
               ">
                  Manage borrower master records
               </p>

            </div>

            <div className="
               flex
               items-center
               gap-3
            ">

               <button
                  className="
                     h-11 px-5 rounded-2xl
                     border border-slate-200
                     bg-white hover:bg-slate-100
                     transition
                     flex items-center gap-2
                     text-sm font-medium text-slate-700
                  "
               >

                  <Download size={18} />

                  Export

               </button>

               <button
                  className="
                     h-11 px-5 rounded-2xl
                     bg-blue-600 hover:bg-blue-700
                     transition
                     flex items-center gap-2
                     text-sm font-medium text-white
                     shadow-lg shadow-blue-500/20
                  "
                  onClick={()=>setIsOpenAddBorrower(true)}
               >

                  <Plus size={18} />

                  Add Borrower

               </button>

            </div>

         </div>

         {/* STATS */}

    <div className="
   grid
   grid-cols-1
   md:grid-cols-2
   xl:grid-cols-4
   gap-6
">

   <SummaryCard
      title="Total Borrowers"
      value={ Number(totalBorrowers).toLocaleString()}
      icon={<Users size={28} />}
      iconClass="bg-blue-100 text-blue-600"
   />

   <SummaryCard
      title="Total Contracts"
      value={ Number(totalContracts).toLocaleString()}
      icon={<FileText size={28} />}
      iconClass="bg-violet-100 text-violet-600"
   />

   <SummaryCard
      title="Financed Amount"
      value={`₱${ Number(totalFinancedAmount).toLocaleString()}`}
      icon={<Wallet size={28} />}
      iconClass="bg-green-100 text-green-600"
   />

   <SummaryCard
      title="Outstanding Balance"
      value={`₱${ Number(totalOutstandingBalance).toLocaleString()}`}
      icon={<BadgeCheck size={28} />}
      iconClass="bg-orange-100 text-orange-600"
   />

</div>

         {/* TABLE SECTION */}

         <div className="
            bg-white
            rounded-3xl
            border border-slate-200
            shadow-sm
            overflow-hidden
         ">

            {/* TOP */}

            <div className="
               p-6
               border-b
               border-slate-200
               flex
               flex-col
               xl:flex-row
               xl:items-center
               justify-between
               gap-4
            ">

               {/* SEARCH */}

               <div className="
                  relative
                  w-full
                  xl:w-87.5
               ">

                  <Search
                     className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                     "
                     size={18}
                  />

                  <input
                     type="text"
                     value={search}
                     onChange={(e) => {
                        setSearch(
                           e.target.value
                        );

                        setPage(1);
                     }}
                     placeholder="
                        Search borrower...
                     "
                     className="
                        w-full
                        h-11
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                     "
                  />

               </div>

               {/* FILTERS */}

               <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
               ">

                  <select
                     value={genderCode}
                     onChange={(e) => {
                        setGenderCode(
                           e.target.value
                        );

                        setPage(1);
                     }}
                     className="
                        h-11
                        px-4
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        text-slate-700
                        outline-none
                     "
                  >

                     <option value="">
                        All Gender
                     </option>

                     <option value="M">
                        Male
                     </option>

                     <option value="F">
                        Female
                     </option>

                  </select>

                  <button
                     className="
                        h-11
                        px-4
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        hover:bg-slate-100
                        transition
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                     "
                  >

                     <Filter size={18} />

                     Filters

                  </button>

               </div>

            </div>

            {/* TABLE */}

            <div className="
               overflow-x-auto
            ">

               <table className="
                  w-full
               ">

                  <thead className="
                     bg-slate-50
                  ">

                     <tr>

                        <th className="
                           text-left
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Subject No
                        </th>

                        <th className="
                           text-left
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Full Name
                        </th>

                        

                        <th className="
                           text-left
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Branch
                        </th>

                        <th className="
                           text-left
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Birth Date
                        </th>

                        <th className="
                           text-left
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Gender
                        </th>

                        <th className="
                           text-right
                           px-6
                           py-4
                           text-sm
                           font-semibold
                           text-slate-600
                        ">
                           Actions
                        </th>

                     </tr>

                  </thead>

                  <tbody>

                     {isLoading && (

                        <tr>

                           <td
                              colSpan={6}
                              className="
                                 text-center
                                 py-10
                              "
                           >
                              Loading...
                           </td>

                        </tr>

                     )}

                     {!isLoading &&
                        clients.length === 0 && (

                        <tr>

                           <td
                              colSpan={6}
                              className="
                                 text-center
                                 py-10
                                 text-slate-500
                              "
                           >
                              No borrowers found
                           </td>

                        </tr>

                     )}

                     {!isLoading &&
                        clients.map((client: StagingClient) => (

                        <tr
                           key={client.id}
                           className="
                              border-t
                              border-slate-100
                              hover:bg-slate-50
                              transition
                           "
                        >

                           <td className="
                              px-6
                              py-5
                              text-sm
                              text-slate-700
                              font-medium
                           ">
                              {
                                 client.providerSubjectNo
                              }
                           </td>

                           <td className="
                              px-6
                              py-5
                           ">

                              <div>

                                 <p className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                 ">

                                    {client.lastName},
                                    {" "}
                                    {client.firstName}
                                    {" "}
                                    {client.middleName}

                                 </p>

                              </div>

                           </td>

                           <td className="
                              px-6
                              py-5
                              text-sm
                              text-slate-700
                           ">
                              {
                                 client.branch.branchName || "-"
                              }
                           </td>

                           <td className="
                              px-6
                              py-5
                              text-sm
                              text-slate-700
                           ">

                              {new Date(
                                 client.birthDate
                              ).toLocaleDateString()}

                           </td>

                           <td className="
                              px-6
                              py-5
                              text-sm
                              text-slate-700
                           ">
                               {
                                 client.gender
                                    ?.description || "-"
                              }
                           </td>

                           <td className="
                              px-6
                              py-5
                           ">

                              <div className="
                                 flex
                                 items-center
                                 justify-end
                                 gap-2
                              ">

                                 <button
                                    className="
                                       w-10
                                       h-10
                                       rounded-xl
                                       bg-slate-100
                                       hover:bg-slate-200
                                       transition
                                       flex
                                       items-center
                                       justify-center
                                       text-slate-700
                                    "
                                    onClick={()=>setViewClient(client)}
                                 >

                                    <Eye size={18} />

                                 </button>

                                 <button
                                    className="
                                       w-10
                                       h-10
                                       rounded-xl
                                       bg-blue-100
                                       hover:bg-blue-200
                                       transition
                                       flex
                                       items-center
                                       justify-center
                                       text-blue-700
                                    "
                                    onClick={() => setEditClient(client)}
                                 >

                                    <Pencil size={18} />

                                 </button>

                              </div>

                           </td>

                        </tr>

                     ))}

                  </tbody>

               </table>

            </div>

            {/* PAGINATION */}

            <div className="
               p-6
               border-t
               border-slate-200
               flex
               items-center
               justify-between
            ">

               <p className="
                  text-sm
                  text-slate-500
               ">

                  Showing
                  {" "}
                  {clients.length}
                  {" "}
                  of
                  {" "}
                  {total}
                  {" "}
                  borrowers

               </p>

               <div className="
                  flex
                  items-center
                  gap-2
               ">

                  <button
                     disabled={page === 1}
                     onClick={() =>
                        setPage(
                           (prev) => prev - 1
                        )
                     }
                     className="
                        w-10
                        h-10
                        rounded-xl
                        border
                        border-slate-200
                        hover:bg-slate-100
                        transition
                        disabled:opacity-50
                     "
                  >
                     ←
                  </button>

                  <div className="
                     px-4
                     text-sm
                     font-medium
                  ">
                     {page}
                  </div>

                  <button
                     disabled={
                        page >=
                        pagination?.totalPages
                     }
                     onClick={() =>
                        setPage(
                           (prev) => prev + 1
                        )
                     }
                     className="
                        w-10
                        h-10
                        rounded-xl
                        border
                        border-slate-200
                        hover:bg-slate-100
                        transition
                        disabled:opacity-50
                     "
                  >
                     →
                  </button>

               </div>

            </div>

         </div>

         {viewClient && (
            <RequestModal
               size="xxxl"
               title="Client Details"
               onClose={() => setViewClient(null)}
            >
               <ClientViewModal client={viewClient} />
            </RequestModal>
         )}


      {isOpenAddBorrower && (
               <RequestModal
                  size="md"
                  title="Add Borrowers"
                  onClose={()=>setIsOpenAddBorrower(false)}>


                  <AddBorrowerModal onUpload={handleUpload}/>
               </RequestModal>
            )

         }

{editClient && (
  <EditClientModal
    isOpen={true}
    client={toEditFormValues(editClient)}
    genders={genders ?? []}
    civilStatuses={civilStatuses ?? []}
    identificationTypes={
      identificationTypes ?? []
    }
    onClose={() => setEditClient(null)}
    onSubmit={handleUpdateClient}
  />
)}

      </div>

   );
}