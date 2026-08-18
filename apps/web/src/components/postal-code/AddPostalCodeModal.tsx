"use client";

import {
  useState,
} from "react";

import {
  MapPinPlus,
  Save,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createPostalCodeSchema,
} from "@repo/shared";
import { useCreatePostalCode } from "@/hooks/postal-code/useCreatePostalCode";


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddPostalCodeModal({
  isOpen,
  onClose,
}: Props) {
  const [regionName, setRegionName] =
    useState("");

  const [provinceName, setProvinceName] =
    useState("");

  const [
    municipalityName,
    setMunicipalityName,
  ] = useState("");

  const [zipCode, setZipCode] =
    useState("");

  const createPostalCode =
    useCreatePostalCode();

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setRegionName("");
    setProvinceName("");
    setMunicipalityName("");
    setZipCode("");
  };

  const handleClose = () => {
    if (createPostalCode.isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result =
      createPostalCodeSchema.safeParse({
        regionName,
        provinceName,
        municipalityName,
        zipCode,

       normalizedProvince:
             provinceName.trim().toUpperCase(),

        normalizedMunicipality:
            municipalityName.trim().toUpperCase(),

        source: "MANUAL",
      });

    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message ??
          "Invalid postal code information."
      );

      return;
    }

    try {
      await createPostalCode.mutateAsync(
        result.data
      );

      toast.success(
        "Postal code added successfully."
      );

      resetForm();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add postal code."
      );
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-2xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            flex items-center
            justify-between
            border-b
            border-gray-200
            px-6 py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <MapPinPlus size={20} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                Add Postal Code
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Add an additional postal code
                reference manually.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={
              createPostalCode.isPending
            }
            className="
              rounded-lg p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="
              grid grid-cols-1
              gap-5
              px-6 py-6
              md:grid-cols-2
            "
          >
            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700
                "
              >
                Region
              </label>

              <input
                type="text"
                value={regionName}
                onChange={(e) =>
                  setRegionName(
                    e.target.value
                  )
                }
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. Region III"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:bg-gray-100
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700
                "
              >
                Province
              </label>

              <input
                type="text"
                value={provinceName}
                onChange={(e) =>
                  setProvinceName(
                    e.target.value
                  )
                }
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. Nueva Ecija"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:bg-gray-100
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700
                "
              >
                Municipality / City
              </label>

              <input
                type="text"
                value={municipalityName}
                onChange={(e) =>
                  setMunicipalityName(
                    e.target.value
                  )
                }
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. Cabanatuan City"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:bg-gray-100
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-medium
                  text-gray-700
                "
              >
                ZIP Code
              </label>

              <input
                type="text"
                value={zipCode}
                onChange={(e) =>
                  setZipCode(
                    e.target.value
                  )
                }
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. 3100"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4 py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:bg-gray-100
                "
              />
            </div>
          </div>

          <div
            className="
              flex items-center
              justify-end gap-3
              border-t
              border-gray-200
              bg-gray-50
              px-6 py-4
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={
                createPostalCode.isPending
              }
              className="
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4 py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createPostalCode.isPending
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4 py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save size={17} />

              {createPostalCode.isPending
                ? "Saving..."
                : "Add Postal Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}