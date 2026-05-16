"use client";

import {
   useForm
} from "react-hook-form";

import {
   zodResolver
} from "@hookform/resolvers/zod";



import { DomainOption, StagingClient, UpdateClientDTO, UpdateClientFormValues, updateClientSchema } from "@repo/shared";
import { useUpdateClient } from "@/hooks/cic/useStaging";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import { useCivilStatusDomain, useGenderDomain, useIdentificationTypeDomain } from "@/hooks/cic/useDomain";

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
      mutateAsync: updateClientMutation
   } = useUpdateClient();

   const {
      data: genders
   } = useGenderDomain();

   const {
      data: civilStatuses
   } = useCivilStatusDomain();

   const {
      data: identoficationTypes
   } = useIdentificationTypeDomain();

   const {

      register,

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
            client.firstName,

         middleName:
            client.middleName,
            

         lastName:
            client.lastName,
         suffix:
            client.suffix || "",

         gender:
            client.gender?.code || "",

         civilStatus:
            client.civilStatus?.code || undefined,


         birthDate:
            client.birthDate
               ? new Date(client.birthDate)
                    .toISOString()
                    .split("T")[0]
               : "",
            
         placeOfBirth:
               client.placeOfBirth || "",

         numberOfDependents:
               client.numberOfDependents ,

         addressType:
            client.addressType || "",
         address:
            client.address || "",
         addressType2:
            client.addressType2 || "",
         address2:
            client.address2 || "",
         
         identificationType:
             client.identificationType?.code || undefined,
         identificationNumber:
            client.identificationNumber || "",

         contactType:
            client.contactType || "",
         contactValue:
            client.contactValue || "",

      }

   });

   const onSubmit =
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

   return (

      <div className="
         fixed
         inset-0
         z-50
         bg-black/40
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
            max-w-6xl
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
               md:grid-cols-3
               gap-5
               ">
   
                  {/* FIRST NAME*/}
                  <InputField
                     label="First Name"
                     placeholder="Enter first name"
                     {...register("firstName")}
                     error={errors.firstName}
                     />

                  {/*MIDDLE NAME */}
                  <InputField
                        label="Middle Name"
                        placeholder="Enter middle name"
                        {...register("middleName")}
                        error={errors.middleName}
                        />
   
                  {/* LAST NAME */}
                  <InputField
                        label="Last Name"
                        placeholder="Enter last name"
                        {...register("lastName")}
                        error={errors.lastName}
                        />

                  {/* SUFFIX */}
                  <InputField
                        label="Suffix"
                        placeholder="Enter suffix"
                        {...register("suffix")}
                        error={errors.suffix}
                        />
                 
   
                  {/* GENDER */}
                  <SelectField
                     label="Gender"
                     error={errors.gender}
                     {...register("gender")}
                     options={
                        genders?.map((item: DomainOption) => ({

                           label:
                              item.description,

                           value:
                              item.code

                        })) || []
                     }
                  />

               {/* Birthdate */}
               <InputField
                     type="date"
                     label="Birthdate"
                     placeholder="Enter birthDate"
                     {...register("birthDate")}
                     error={errors.birthDate}
                     />

               {/* Place of Birth */}
                 <InputField
                     label="Place of Birth"
                     placeholder="Enter place of birth"
                     containerClassName="col-span-2"
                     {...register("placeOfBirth")}
                     error={errors.placeOfBirth}
                     />
             
                 
                  
                {/* Civil Status */}

                <SelectField
                  label="Civil Status"
                  {...register("civilStatus")}
                  error={errors.civilStatus}
                  options={
                     civilStatuses?.map((item: DomainOption) => ({
                        label:
                           item.description,
                        value:
                           item.code
                     })) || []
                  }
                  />

                  <div
                       className="
                       grid
                       grid-cols-[50%_50%]
                       gap-4"
                     >

                  {/* Number of Dependents */}
                 <InputField
                     type="number"
                     label="Number of Dependents"
                     placeholder="Enter number of dependents"
                     {...register(
                        "numberOfDependents",
                        {
                           valueAsNumber: true
                        }
                     )}
                     error={errors.numberOfDependents}
                     />
                  {/* Address Type */}
                  <SelectField
                           label="Address Type"
                           {...register("addressType")}
                           error={errors.addressType}
                           options={[
                           {
                              label: "Main Address",
                              value: "MI"
                           },
                           {
                              label: "Additional  Address",
                              value: "AI"
                           }
                        ]}
                     />

                     </div>

               {/* Full Address */}
                  <InputField
                     containerClassName="col-span-2"
                     label="Full Address"
                     {...register("address")}
                     error={errors.address}
                  />

                     {/* Address  2 Type */}
                     <SelectField
                           label="Address 2 Type"
                           {...register("addressType2")}
                           error={errors.addressType2}
                           options={[
                           {
                              label: "Main Address",
                              value: "MI"
                           },
                           {
                              label: "Additional  Address",
                              value: "AI"
                           }
                        ]}
                     />

                  {/* Full Address2 */}
                  <InputField
                     containerClassName="col-span-2"
                     label="Full Address 2"
                     {...register("address2")}
                     error={errors.address2}
                  />

                  {/* Identification Type */}

                  <SelectField
                     label="Identification Type"
                     error={errors.identificationType}
                     {...register("identificationType")}
                     options={
                        identoficationTypes?.map((item: DomainOption) => ({

                           label:
                              item.description,

                           value:
                              item.code

                        })) || []
                     }
                  />
                
                  {/* Identification Number */}
                  <InputField
                     label="Identification Number"
                     {...register("identificationNumber")}
                     error={errors.identificationNumber}
                  />

                  {/* Contact Type */}
                  <InputField
                     label="Contact Type"
                     {...register("contactType")}
                     error={errors.contactType}
                  />
                  {/* Contact Value */}
                  <InputField
                     label="Contact Value"
                     {...register("contactValue")}
                     error={errors.contactValue}
                  />

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