// components/cic/review/forms/LoanInformationForm.tsx

"use client";

import {

   FieldErrors,
   UseFormRegister

} from "react-hook-form";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

import {
   DomainItem,
   UpdateLoanFormValues
} from "@repo/shared";
import { useDomains } from "@/hooks/useGeneral";

type Props = {

   register:
      UseFormRegister<UpdateLoanFormValues>;

   errors:
      FieldErrors<UpdateLoanFormValues>;

};

export default function LoanInformationForm({

   register,

   errors

}: Props) {
   const {data: contract_type} = useDomains("CONTRACT_TYPE")
   const {data: contract_phase} = useDomains("CONTRACT_PHASE")


   return (

      <div className = "space-y-10"  >

         {
         /* =======================================================
            CONTRACT INFORMATION
         ======================================================= */}
         <div
            className="
               space-y-4
            "
         >

            <div>

               <h3
                  className="
                     text-lg
                     font-semibold
                     text-gray-900
                  "
               >
                  Contract Information
               </h3>

               <p
                  className="
                     text-sm
                     text-gray-500
                  "
               >
                  Basic contract details
               </p>

            </div>

            <div
               className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
               "
            >

               {/* CONTRACT NO */}

               <InputField
                  label="Contract Number"
                  placeholder="Enter contract number"
                  {...register("contractNo")}
                  error={errors.contractNo}
               />

               {/* CONTRACT TYPE */}

              
               <SelectField
                  label="Contract Type"
                  error={errors.contractType}
                  {...register("contractType")}
                  options={
                     contract_type?.map((item: DomainItem) => ({
                        label:
                           item.description,
                        value:
                           String(item.code)
                     })) || []
                  }
               />

               {/* CONTRACT STATUS */}

               <SelectField
                  label="Contract Status"
                  {...register("contractStatus")}
                  error={errors.contractStatus}
                  options={[

                     {
                        label: "Active",
                        value: "AC"
                     },

                     {
                        label: "Closed",
                        value: "CL"
                     },

                     {
                        label: "Past Due",
                        value: "PD"
                     }

                  ]}
               />

               {/* CONTRACT PHASE */}
           
               <SelectField
                  label="Contract Phase"
                  error={errors.contractPhase}
                  {...register("contractPhase")}
                  options={
                     contract_phase?.map((item: DomainItem) => ({
                        label:
                           item.description,
                        value:
                           String(item.code)
                     })) || []
                  }
               />

               {/* CURRENCY */}

               <InputField
                  label="Currency"
                  placeholder="PHP"
                  {...register("currency")}
                  error={errors.currency}
               />

               {/* ORIGINAL CURRENCY */}

               <InputField
                  label="Original Currency"
                  placeholder="PHP"
                  {...register("originalCurrency")}
                  error={errors.originalCurrency}
               />

            </div>

         </div>

         {/* =======================================================
            PAYMENT INFORMATION
         ======================================================= */}

         <div
            className="
               space-y-4
            "
         >

            <div>

               <h3
                  className="
                     text-lg
                     font-semibold
                     text-gray-900
                  "
               >
                  Payment Information
               </h3>

               <p
                  className="
                     text-sm
                     text-gray-500
                  "
               >
                  Loan and payment details
               </p>

            </div>

            <div
               className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
               "
            >

               {/* FINANCED AMOUNT */}

               <InputField
                  type="number"
                  label="Financed Amount"
                  placeholder="0.00"
                  {...register(
                     "financedAmount",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.financedAmount}
               />

               {/* INSTALLMENTS */}

               <InputField
                  type="number"
                  label="Installments Number"
                  placeholder="12"
                  {...register(
                     "installmentsNumber",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.installmentsNumber}
               />

               {/* MONTHLY PAYMENT */}

               <InputField
                  type="number"
                  label="Monthly Payment Amount"
                  placeholder="0.00"
                  {...register(
                     "monthlyPaymentAmount",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.monthlyPaymentAmount}
               />

               {/* LAST PAYMENT */}

               <InputField
                  type="number"
                  label="Last Payment Amount"
                  placeholder="0.00"
                  {...register(
                     "lastPaymentAmount",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.lastPaymentAmount}
               />

               {/* NEXT PAYMENT */}

               <InputField
                  type="number"
                  label="Next Payment Amount"
                  placeholder="0.00"
                  {...register(
                     "nextPaymentAmount",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.nextPaymentAmount}
               />
           

               {/* OUTSTANDING BALANCE */}

               <InputField
                  type="number"
                  label="Outstanding Balance"
                  placeholder="0.00"
                  {...register(
                     "outstandingBalance",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.outstandingBalance}
               />

               {/* OVERDUE AMOUNT */}

               <InputField
                  type="number"
                  label="Overdue Payment Amount"
                  placeholder="0.00"
                  {...register(
                     "overduePaymentAmount",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.overduePaymentAmount}
               />

            </div>

         </div>

         {/* =======================================================
            SCHEDULE INFORMATION
         ======================================================= */}

         <div
            className="
               space-y-4
            "
         >

            <div>

               <h3
                  className="
                     text-lg
                     font-semibold
                     text-gray-900
                  "
               >
                  Schedule Information
               </h3>

               <p
                  className="
                     text-sm
                     text-gray-500
                  "
               >
                  Contract schedule and payment dates
               </p>

            </div>

            <div
               className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
               "
            >

               {/* START DATE */}

               <InputField
                  type="date"
                  label="Contract Start Date"
                  {...register("contractStartDate")}
                  error={errors.contractStartDate}
               />

               {/* REQUEST DATE */}

               <InputField
                  type="date"
                  label="Contract Request Date"
                  {...register("contractRequestDate")}
                  error={errors.contractRequestDate}
               />

               {/* END PLANNED */}

               <InputField
                  type="date"
                  label="Planned End Date"
                  {...register("contractEndPlannedDate")}
                  error={errors.contractEndPlannedDate}
               />

               {/* END ACTUAL */}

               <InputField
                  type="date"
                  label="Actual End Date"
                  {...register("contractEndActualDate")}
                  error={errors.contractEndActualDate}
               />

               {/* FIRST PAYMENT */}

               <InputField
                  type="date"
                  label="First Payment Date"
                  {...register("firstPaymentDate")}
                  error={errors.firstPaymentDate}
               />

               {/* LAST PAYMENT */}

               <InputField
                  type="date"
                  label="Last Payment Date"
                  {...register("lastPaymentDate")}
                  error={errors.lastPaymentDate}
               />

               {/* NEXT PAYMENT */}

               <InputField
                  type="date"
                  label="Next Payment Date"
                  {...register("nextPaymentDate")}
                  error={errors.nextPaymentDate}
               />

            </div>

         </div>

         {/* =======================================================
            COLLECTION INFORMATION
         ======================================================= */}

         <div
            className="
               space-y-4
            "
         >

            <div>

               <h3
                  className="
                     text-lg
                     font-semibold
                     text-gray-900
                  "
               >
                  Collection Information
               </h3>

               <p
                  className="
                     text-sm
                     text-gray-500
                  "
               >
                  Outstanding and overdue collection data
               </p>

            </div>

            <div
               className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
               "
            >

               {/* OUTSTANDING PAYMENT NUMBER */}

               <InputField
                  type="number"
                  label="Outstanding Payment Number"
                  placeholder="0"
                  {...register(
                     "outstandingPaymentNumber",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.outstandingPaymentNumber}
               />

               {/* OVERDUE PAYMENT NUMBER */}

               <InputField
                  type="number"
                  label="Overdue Payment Number"
                  placeholder="0"
                  {...register(
                     "overduePaymentNumber",
                     {
                        valueAsNumber: true
                     }
                  )}
                  error={errors.overduePaymentNumber}
               />

               {/* PAYMENT PERIODICITY */}

               <SelectField
                  label="Payment Periodicity"
                  {...register("paymentPeriodicity")}
                  error={errors.paymentPeriodicity}
                  options={[

                     {
                        label: "Monthly",
                        value: "M"
                     },

                     {
                        label: "Quarterly",
                        value: "Q"
                     },

                     {
                        label: "Semi Annual",
                        value: "S"
                     },

                     {
                        label: "Annual",
                        value: "A"
                     }

                  ]}
               />

               {/* PAYMENT METHOD */}

               <SelectField
                  label="Payment Method"
                  {...register("paymentMethod")}
                  error={errors.paymentMethod}
                  options={[

                     {
                        label: "Others",
                        value: "OTH"
                     },

                     {
                        label: "Cash",
                        value: "CSH"
                     },

                     {
                        label: "Check",
                        value: "CHK"
                     },

                     {
                        label: "Bank Transfer",
                        value: "BNK"
                     }

                  ]}
               />

               {/* TRANSACTION TYPE */}

               <InputField
                  label="Transaction Type"
                  placeholder="NA"
                  {...register("transactionType")}
                  error={errors.transactionType}
               />

            </div>

         </div>

      </div>

   );

}