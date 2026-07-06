"use client";

import { useEffect, useState } from "react";

import {
   useForm
} from "react-hook-form";

import {
   zodResolver
} from "@hookform/resolvers/zod";

import {

   
 
   UpdateClientDTO,

   UpdateClientFormValues,

   updateClientSchema,
   UpdateLoanFormValues,
   updateLoanSchema

} from "@repo/shared";

import {

   useUpdateClient,
   useUpdateStagingContract

} from "@/hooks/cic/useStaging";

import {

   useCivilStatusDomain,
   useGenderDomain,
   useIdentificationTypeDomain

} from "@/hooks/cic/useDomain";

import ClientInformationForm from
"@/components/cic/review/forms/ClientInformationForm";
import LoanInformationForm from "./forms/LoanInformationForm";
import { ReviewClient } from "@/types/review.types";
import { X } from "lucide-react";
import RequestModal from "@/components/Modal";
import ErrorValidationModal from "./forms/ErrorValidationModal";





type Props = {

   reviewClient: ReviewClient;

   onClose: () => void;

   refresh: () => void;

};

type ActiveTab =
   "CLIENT"
   | "LOAN";

export default function ClientDrawer({

   reviewClient,

   onClose,

   refresh

}: Props) {

   const client =
   reviewClient.stagingClient;




const mergedPreview =
   reviewClient.mergedPreview;

const existingClient =
   reviewClient.existingClient;

   const [activeTab, setActiveTab] =
      useState<ActiveTab>("CLIENT");

   
   const [errorModal, setErrorModal] = useState(false);

   

   /*
   |--------------------------------------------------------------------------
   | FIRST CONTRACT
   |--------------------------------------------------------------------------
   */

   const firstContract =
      client.stagingContracts?.[0];

   /*
   |--------------------------------------------------------------------------
   | MUTATIONS
   |--------------------------------------------------------------------------
   */

   
   const {

      mutateAsync: updateClientMutation

   } = useUpdateClient();

   const {

      mutateAsync: updateLoanMutation

   } = useUpdateStagingContract();

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

   /*
   |--------------------------------------------------------------------------
   | CLIENT FORM
   |--------------------------------------------------------------------------
   */

   const {

      register,
      reset,

      handleSubmit,

      formState: {
         errors
      }

   } = useForm<UpdateClientFormValues>({

      resolver:
         zodResolver(
            updateClientSchema
         ),

      defaultValues: {

         firstName:
            client.firstName || "",

         middleName:
            client.middleName || "",

         lastName:
            client.lastName || "",

         suffix:
            client.suffix || "",

         gender:
            mergedPreview.genderCode || "",

         civilStatus:
             mergedPreview.civilStatusCode || "",

         birthDate:
            client.birthDate
               ? new Date(client.birthDate)
                    .toISOString()
                    .split("T")[0]
               : "",

         placeOfBirth:
            client.placeOfBirth || "",

         numberOfDependents:
            client.numberOfDependents || 0,

         addressType:
            client.addressType || "",

         address:
            mergedPreview.address || "",

         addressType2:
            client.addressType2 || "",

         address2:
              mergedPreview.address || "",

         identificationType:
              mergedPreview.identificationTypeCode || "",

         identificationNumber:
            client.identificationNumber || "",


       secondaryIdentificationType:
            mergedPreview.secondaryIdentificationTypeCode || "",

         secondaryIdentificationNumber:
            mergedPreview.secondaryIdentificationNumber || "",

         contactType:
            mergedPreview.contactType || "",

         contactValue:
            mergedPreview.contactValue || ""

      }

   });


   useEffect(() => {
      if (!client || !genders || !civilStatuses || !identificationTypes) {
         return;
      }
   
      reset({
         firstName: client.firstName || "",
         middleName: client.middleName || "",
         lastName: client.lastName || "",
         suffix: client.suffix || "",
   
         gender: String(mergedPreview.genderCode || ""),
         civilStatus: String(mergedPreview.civilStatusCode || ""),
         identificationType: String(mergedPreview.identificationTypeCode || ""),
         secondaryIdentificationType: String(mergedPreview.secondaryIdentificationTypeCode || ""),
   
         birthDate: client.birthDate
            ? new Date(client.birthDate).toISOString().split("T")[0]
            : "",
   
         placeOfBirth: client.placeOfBirth || "",
         numberOfDependents: client.numberOfDependents || 0,
   
         addressType: client.addressType || "",
         address: mergedPreview.address || "",
   
         addressType2: client.addressType2 || "",
         address2: mergedPreview.address || "",
   
         contactType: String(mergedPreview.contactType || ""),
         contactValue: mergedPreview.contactValue || "",
      });
   }, [
      client,
      genders,
      civilStatuses,
      identificationTypes,
      mergedPreview,
      reset,
   ]);

   /*
   |--------------------------------------------------------------------------
   | LOAN FORM
   |--------------------------------------------------------------------------
   */

   const {

      register: registerLoan,

      handleSubmit: handleLoanSubmit,

      formState: {
         errors: loanErrors
      }

   } = useForm<UpdateLoanFormValues>({
      resolver:
      zodResolver(
         updateLoanSchema
      ),

      defaultValues: {

         contractNo:
            firstContract?.contractNo || "",
      
         contractType:
            firstContract?.contractType || 15,
      
         contractPhase:
            firstContract?.contractPhase || "AC",
      
         contractStatus:
            firstContract?.contractStatus || "",
      
         currency:
            firstContract?.currency || "PHP",
      
         originalCurrency:
            firstContract?.originalCurrency || "PHP",
      
         contractStartDate:
            firstContract?.contractStartDate
               ? new Date(firstContract.contractStartDate)
                    .toISOString()
                    .split("T")[0]
               : "",
         contractRequestDate:
            firstContract?.contractRequestDate
               ? new Date(firstContract.contractRequestDate)
                    .toISOString()
                    .split("T")[0]
               : "",
      
         contractEndPlannedDate:
            firstContract?.contractEndPlannedDate
               ? new Date(firstContract.contractEndPlannedDate)
                    .toISOString()
                    .split("T")[0]
               : "",

         contractEndActualDate:
               firstContract?.contractEndActualDate
                  ? new Date(firstContract.contractEndActualDate)
                       .toISOString()
                       .split("T")[0]
                  : "",
         firstPaymentDate:
            firstContract?.firstPaymentDate
               ? new Date(firstContract.firstPaymentDate)
                     .toISOString()
                     .split("T")[0]
               : "",
         lastPaymentDate:
               firstContract?.lastPaymentDate
                  ? new Date(firstContract.lastPaymentDate)
                        .toISOString()
                        .split("T")[0]
                  : "",
          nextPaymentDate:
            firstContract?.nextPaymentDate
               ? new Date(firstContract.nextPaymentDate)
                     .toISOString()
                     .split("T")[0]
               : "",
            
      
         financedAmount:
            Number(
               firstContract?.financedAmount || 0
            ),
      
         installmentsNumber:
            firstContract?.installmentsNumber || 0,
      
         monthlyPaymentAmount:
            Number(
               firstContract?.monthlyPaymentAmount || 0
            ),

          outstandingPaymentNumber:
            Number(
               firstContract?.outstandingPaymentNumber || 0
            ),
      
         outstandingBalance:
            Number(
               firstContract?.outstandingBalance || 0
            ),
      
         overduePaymentAmount:
            Number(
               firstContract?.overduePaymentAmount || 0
            ),

            overduePaymentNumber:
            Number(
               firstContract?.overduePaymentNumber || 0
            ),


         lastPaymentAmount:
            Number(
               firstContract?.lastPaymentAmount || 0
            ),

         nextPaymentAmount:
            Number(
               firstContract?.nextPaymentAmount || 0
            ),
            
      }

   });

   /*
   |--------------------------------------------------------------------------
   | SAVE CLIENT
   |--------------------------------------------------------------------------
   */

   const onSubmitClient =
   async (
      values: UpdateClientDTO
   ) => {

      await updateClientMutation({

         id: client.id,

         values

      });

      refresh();

      onClose();

   };

   /*
   |--------------------------------------------------------------------------
   | SAVE LOAN
   |--------------------------------------------------------------------------
   */

   const onSubmitLoan =
   async (
      values: UpdateLoanFormValues
   ) => {

      if (!firstContract) {
         return;
      }

      await updateLoanMutation({

         id: firstContract.id,
      
         values: {
      
            contractNo:
               values.contractNo,
      
            contractType:
               Number(values.contractType),
      
            contractPhase:
               values.contractPhase,
      
            contractStatus:
               values.contractStatus,
      
            currency:
               values.currency,
      
            originalCurrency:
               values.originalCurrency,
      
            contractStartDate:
               values.contractStartDate,
      
            contractEndPlannedDate:
               values.contractEndPlannedDate,
      
            financedAmount:
               Number(values.financedAmount),
      
            installmentsNumber:
               Number(values.installmentsNumber),
      
            monthlyPaymentAmount:
               Number(values.monthlyPaymentAmount),
      
            outstandingBalance:
               Number(values.outstandingBalance),
      
            overduePaymentAmount:
               Number(values.overduePaymentAmount)
      
         }
      
      });

      refresh();

      onClose();

   };

   return (

      <div
         className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            justify-end
         "
      >

         <div
            className="
               h-screen
               w-full
               max-w-7xl
               bg-white
               shadow-2xl
               overflow-y-auto
               flex
               flex-col
            "
         >

            {/* HEADER */}

            <div
               className="
                  sticky
                  top-0
                  z-20
                  bg-white
                  border-b
                  px-8
                  py-6
                  flex
                  items-center
                  justify-between
               "
            >

               <div>

                  <h2
                     className="
                        text-3xl
                        font-bold
                     "
                  >
                     Review CIC Record
                  </h2>

                  <p
                     className="
                        text-sm
                        text-gray-500
                        mt-1
                     "
                  >
                     Review borrower and loan information
                  </p>

               </div>

               <button
                  onClick={onClose}
                  className="
                     flex
                     items-center
                     justify-center
                     w-9
                     h-9
                     rounded-xl
                     text-slate-500
                     hover:text-slate-800
                     hover:bg-slate-100
                     transition-all
                     duration-200
                     cursor-pointer
                  "
                  aria-label="Close Drawer"
               >
                  <X size={28} />
               </button>

            </div>

            {/* TABS */}

            <div
               className="
                  px-8
                  border-b
                  flex
                  gap-4
               "
            >

               <button

                  type="button"

                  onClick={() =>
                     setActiveTab("CLIENT")
                  }

                  className={`
                     py-4
                     border-b-2
                     text-sm
                     font-medium
                     ${
                        activeTab === "CLIENT"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500"
                     }
                  `}
               >
                  Client Information
               </button>

               <button

                  type="button"

                  onClick={() =>
                     setActiveTab("LOAN")
                  }

                  className={`
                     py-4
                     border-b-2
                     text-sm
                     font-medium
                     ${
                        activeTab === "LOAN"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500"
                     }
                  `}
               >
                  Loan Information
               </button>

            </div>

            {/* BODY */}

            <div
               className="
                  flex-1
                  overflow-y-auto
                  px-8
                  py-6
               "
            >
             <div className="
                        bg-gray-50
                        border
                        rounded-2xl
                        p-5
                        mb-4
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
                                       cursor-pointer
                                    "
                                    onClick={()=>setErrorModal(true)}
                                    >
                                       WITH ERRORS
                                    </span>
         
                                 )
         
                              }
         
                           </div>
         
                        </div>
         
                     </div>
         
               {
                  activeTab === "CLIENT"
                  && (

                     <form
                        onSubmit={
                           handleSubmit(
                              onSubmitClient
                           )
                        }
                        className="
                           space-y-6
                        "
                     >

                        <ClientInformationForm

                           register={register}

                           errors={errors}

                           genders={
                              genders || []
                           }

                           civilStatuses={
                              civilStatuses || []
                           }

                           identificationTypes={
                              identificationTypes || []
                           }

                        />

                        <div
                           className="
                              flex
                              justify-end
                              gap-3
                           "
                        >

                           <button
                              type="submit"
                              className="
                                 bg-blue-600
                                 text-white
                                 px-6
                                 py-3
                                 rounded-xl
                              "
                           >
                              Save Client
                           </button>

                        </div>

                     </form>

                  )
               }

               {
                  activeTab === "LOAN"
                  && (

                     <form
                        onSubmit={
                           handleLoanSubmit(
                              onSubmitLoan
                           )
                        }
                        className="
                           space-y-6
                        "
                     >

                        <LoanInformationForm

                           register={registerLoan}

                           errors={loanErrors}

                        />

                        <div
                           className="
                              flex
                              justify-end
                              gap-3
                           "
                        >

                           <button
                              type="submit"
                              className="
                                 bg-blue-600
                                 text-white
                                 px-6
                                 py-3
                                 rounded-xl
                              "
                           >
                              Save Loan
                           </button>

                        </div>

                     </form>

                  )
               }

            </div>

         </div>

         {errorModal && (
            <ErrorValidationModal onClose={()=>setErrorModal(false)}  open={errorModal} reviewClient={reviewClient} />
         )}

      </div>

   );

}