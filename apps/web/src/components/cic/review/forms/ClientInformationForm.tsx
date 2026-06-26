// components/cic/review/forms/ClientInformationForm.tsx

"use client";

import {
   UseFormRegister,
   FieldErrors
} from "react-hook-form";

import {
   DomainItem,
   DomainOption,
 
   UpdateClientFormValues
} from "@repo/shared";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import { useDomains } from "@/hooks/useGeneral";

type Props = {

   register:
      UseFormRegister<UpdateClientFormValues>;

   errors:
      FieldErrors<UpdateClientFormValues>;

   genders:
      DomainOption[];

   civilStatuses:
      DomainOption[];

   identificationTypes:
      DomainOption[];
  

};

export default function ClientInformationForm({

   register,

   errors,

   genders,

   civilStatuses,

   identificationTypes,

}: Props) {


   const {data: contact_type} = useDomains("CONTACT_TYPE")

   return (

         <div>
              
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
                                   String(item.code)
      
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
                              String(item.code)
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
                             identificationTypes?.map((item: DomainOption) => ({
                                 label:
                                    item.description,
      
                                 value:
                                 String(item.code)
      
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
                            <SelectField
                                         label="Contract Type"
                                         error={errors.contactType}
                                         {...register("contactType")}
                                         options={
                                          contact_type?.map((item: DomainItem) => ({
                                               label:
                                                  item.description,
                                               value:
                                                  String(item.code)
                                            })) || []
                                         }
                                      />
                        {/* Contact Value */}
                        <InputField
                           label="Contact Value"
                           {...register("contactValue")}
                           error={errors.contactValue}
                        />
      
                     </div>
                </div>
                        
      
   );

}