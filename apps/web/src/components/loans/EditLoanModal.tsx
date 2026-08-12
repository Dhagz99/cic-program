"use client";

import { useEffect } from "react";
import {
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateLoanSchema,
  UpdateLoanFormValues,
  ClientLoan,
} from "@repo/shared";
import { FormField } from "../utils/FormField";

type EditLoanModalProps = {
  isOpen: boolean;
  loan: ClientLoan | null;
  onClose: () => void;
  onSubmit: (
    values: UpdateLoanFormValues
  ) => Promise<void> | void;
};

const emptyValues: UpdateLoanFormValues = {
  contractNo: "",
  contractType: undefined,
  contractPhase: "",
  contractStatus: "",
  currency: "",
  originalCurrency: "",

  contractStartDate: "",
  contractRequestDate: "",
  contractEndPlannedDate: "",
  contractEndActualDate: "",
  firstPaymentDate: "",
  lastPaymentDate: "",
  nextPaymentDate: "",

  financedAmount: 0,
  installmentsNumber: undefined,
  monthlyPaymentAmount: undefined,
  lastPaymentAmount: undefined,
  nextPaymentAmount: undefined,
  outstandingBalance: undefined,
  overduePaymentAmount: undefined,
  outstandingPaymentNumber: undefined,
  overduePaymentNumber: undefined,

  paymentPeriodicity: "",
  paymentMethod: "",
  transactionType: "",
};

function formatDateForInput(
  value: string | Date | null | undefined
) {
  if (!value) return "";

  return new Date(value)
    .toISOString()
    .slice(0, 10);
}

export default function EditLoanModal({
  isOpen,
  loan,
  onClose,
  onSubmit,
}: EditLoanModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty
    },
  } = useForm<UpdateLoanFormValues>({
    resolver: zodResolver(updateLoanSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!loan) {
      reset(emptyValues);
      return;
    }

    reset({
      contractNo: loan.contractNo ?? "",

      contractType:
        loan.contractType ?? undefined,

      contractPhase:
        loan.contractPhase ?? "",

      contractStatus:
        loan.contractStatus ?? "",

      currency:
        loan.currency ?? "",

      originalCurrency:
        loan.originalCurrency ?? "",

      contractStartDate:
        formatDateForInput(
          loan.contractStartDate
        ),

      contractRequestDate:
        formatDateForInput(
          loan.contractRequestDate
        ),

      contractEndPlannedDate:
        formatDateForInput(
          loan.contractEndPlannedDate
        ),

      contractEndActualDate:
        formatDateForInput(
          loan.contractEndActualDate
        ),

      firstPaymentDate:
        formatDateForInput(
          loan.firstPaymentDate
        ),

      lastPaymentDate:
        formatDateForInput(
          loan.lastPaymentDate
        ),

      nextPaymentDate:
        formatDateForInput(
          loan.nextPaymentDate
        ),

      financedAmount:
        Number(loan.financedAmount ?? 0),

      installmentsNumber:
        loan.installmentsNumber != null
          ? Number(loan.installmentsNumber)
          : undefined,

      monthlyPaymentAmount:
        loan.monthlyPaymentAmount != null
          ? Number(loan.monthlyPaymentAmount)
          : undefined,

      lastPaymentAmount:
        loan.lastPaymentAmount != null
          ? Number(loan.lastPaymentAmount)
          : undefined,

      nextPaymentAmount:
        loan.nextPaymentAmount != null
          ? Number(loan.nextPaymentAmount)
          : undefined,

      outstandingBalance:
        loan.outstandingBalance != null
          ? Number(loan.outstandingBalance)
          : undefined,

      overduePaymentAmount:
        loan.overduePaymentAmount != null
          ? Number(loan.overduePaymentAmount)
          : undefined,

      outstandingPaymentNumber:
        loan.outstandingPaymentNumber != null
          ? Number(
              loan.outstandingPaymentNumber
            )
          : undefined,

      overduePaymentNumber:
        loan.overduePaymentNumber != null
          ? Number(loan.overduePaymentNumber)
          : undefined,

      paymentPeriodicity:
        loan.paymentPeriodicity ?? "",

      paymentMethod:
        loan.paymentMethod ?? "",

      transactionType:
        loan.transactionType ?? "",
    });
  }, [loan, reset]);

  const submitHandler:
    SubmitHandler<UpdateLoanFormValues> =
      async (values) => {
        await onSubmit(values);
      };

  if (!isOpen) {
    return null;
  }

  const inputClass = `
  w-full
  rounded-lg
  border
  border-gray-300
  bg-white
  px-3
  py-2.5
  text-sm
  text-gray-900
  outline-none
  transition
  placeholder:text-gray-400
  hover:border-gray-400
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
`;

const numberOrUndefined = (
  value: string
) => {
  return value === ""
    ? undefined
    : Number(value);
};


  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-[1px]">
    <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Loan
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update contract and payment information.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* CONTRACT INFORMATION */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Contract Information
              </h3>

              <p className="text-xs text-gray-500">
                General contract details and current status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Contract No."
                error={errors.contractNo?.message}
              >
                <input
                  {...register("contractNo")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Contract Type">
                <input
                  type="number"
                  {...register("contractType", {
                    setValueAs: (value) =>
                      value === ""
                        ? undefined
                        : Number(value),
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Contract Phase">
                <input
                  {...register("contractPhase")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Contract Status">
                <input
                  {...register("contractStatus")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Currency">
                <input
                  {...register("currency")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Original Currency">
                <input
                  {...register("originalCurrency")}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          <div className="my-7 border-t" />

          {/* CONTRACT DATES */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Contract Dates
              </h3>

              <p className="text-xs text-gray-500">
                Contract lifecycle and payment dates.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField label="Contract Start Date">
                <input
                  type="date"
                  {...register("contractStartDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Contract Request Date">
                <input
                  type="date"
                  {...register("contractRequestDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Planned End Date">
                <input
                  type="date"
                  {...register("contractEndPlannedDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Actual End Date">
                <input
                  type="date"
                  {...register("contractEndActualDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="First Payment Date">
                <input
                  type="date"
                  {...register("firstPaymentDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Last Payment Date">
                <input
                  type="date"
                  {...register("lastPaymentDate")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Next Payment Date">
                <input
                  type="date"
                  {...register("nextPaymentDate")}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          <div className="my-7 border-t" />

          {/* PAYMENT INFORMATION */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Payment Information
              </h3>

              <p className="text-xs text-gray-500">
                Loan amount, installment schedule, and payment values.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Financed Amount"
                error={errors.financedAmount?.message}
              >
                <input
                  type="number"
                  step="0.01"
                  {...register("financedAmount", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Installments Number">
                <input
                  type="number"
                  {...register("installmentsNumber", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Monthly Payment">
                <input
                  type="number"
                  step="0.01"
                  {...register("monthlyPaymentAmount", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Last Payment Amount">
                <input
                  type="number"
                  step="0.01"
                  {...register("lastPaymentAmount", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Next Payment Amount">
                <input
                  type="number"
                  step="0.01"
                  {...register("nextPaymentAmount", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Payment Periodicity">
                <input
                  {...register("paymentPeriodicity")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Payment Method">
                <input
                  {...register("paymentMethod")}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Transaction Type">
                <input
                  {...register("transactionType")}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          <div className="my-7 border-t" />

          {/* BALANCE / OVERDUE */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Balance & Overdue Information
              </h3>

              <p className="text-xs text-gray-500">
                Current outstanding and overdue balances.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField label="Outstanding Balance">
                <input
                  type="number"
                  step="0.01"
                  {...register("outstandingBalance", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Outstanding Payment No.">
                <input
                  type="number"
                  {...register("outstandingPaymentNumber", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Overdue Payment Amount">
                <input
                  type="number"
                  step="0.01"
                  {...register("overduePaymentAmount", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Overdue Payment No.">
                <input
                  type="number"
                  {...register("overduePaymentNumber", {
                    setValueAs: numberOrUndefined,
                  })}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
             disabled={!isDirty || isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}