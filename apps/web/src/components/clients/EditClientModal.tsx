"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { X } from "lucide-react";

import {
  DomainOption,
  UpdateClientFormValues
} from "@repo/shared";

import ClientInformationForm from
  "@/components/cic/review/forms/ClientInformationForm";

type Props = {
  isOpen: boolean;
  client: UpdateClientFormValues | null;

  genders: DomainOption[];
  civilStatuses: DomainOption[];
  identificationTypes: DomainOption[];

  onClose: () => void;

  onSubmit: (
    values: UpdateClientFormValues
  ) => Promise<void> | void;
};

const emptyValues: UpdateClientFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  gender: "",
  birthDate: "",
  placeOfBirth: "",
  civilStatus: "",
  numberOfDependents: 0,

  addressType: "MI",
  address: "",
  addressType2: "AI",
  address2: "",

  identificationType: "",
  identificationNumber: "",
  secondaryIdentificationType: "",
  secondaryIdentificationNumber: "",

  contactType: "",
  contactValue: ""
};

export default function EditClientModal({
  isOpen,
  client,
  genders,
  civilStatuses,
  identificationTypes,
  onClose,
  onSubmit
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty
    }
  } = useForm<UpdateClientFormValues>({
    defaultValues: emptyValues
  });

  /*
   * Populate the form whenever the selected client changes.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!client) {
      reset(emptyValues);
      return;
    }

    reset({
      ...emptyValues,
      ...client,

      // HTML date inputs require YYYY-MM-DD.
      birthDate: client.birthDate
        ? String(client.birthDate).slice(0, 10)
        : "",

      numberOfDependents:
        Number(client.numberOfDependents ?? 0)
    });
  }, [isOpen, client, reset]);

  /*
   * Allow Escape to close the modal.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  const submitForm: SubmitHandler<
    UpdateClientFormValues
  > = async (values) => {
    await onSubmit({
      ...values,
      numberOfDependents:
        Number(values.numberOfDependents ?? 0)
    });

    onClose();
  };

  if (!isOpen || !client) {
    return null;
  }


  console.log("client: ", client)

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-client-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex max-h-[92vh] w-full max-w-6xl
          flex-col overflow-hidden rounded-xl
          bg-white shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            flex items-center justify-between
            border-b border-gray-200
            px-6 py-4
          "
        >
          <div>
            <h2
              id="edit-client-title"
              className="text-xl font-semibold text-gray-900"
            >
              Edit Client
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the client&apos;s personal,
              address and identification information.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="
              rounded-lg p-2 text-gray-500
              transition hover:bg-gray-100
              hover:text-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close edit client modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable content */}

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <ClientInformationForm
              register={register}
              errors={errors}
              genders={genders}
              civilStatuses={civilStatuses}
              identificationTypes={
                identificationTypes
              }
            />
          </div>

          {/* Footer */}

          <div
            className="
              flex items-center justify-end gap-3
              border-t border-gray-200
              bg-gray-50 px-6 py-4
            "
          >
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="
                rounded-lg border border-gray-300
                bg-white px-5 py-2.5
                text-sm font-medium text-gray-700
                transition hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="
                rounded-lg bg-blue-600
                px-5 py-2.5
                text-sm font-medium text-white
                transition hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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