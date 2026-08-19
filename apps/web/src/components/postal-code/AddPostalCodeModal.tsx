"use client";

import { useState } from "react";

import {
  MapPinPlus,
  Save,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createPostalCodeSchema,
} from "@repo/shared";

import {
  useCreatePostalCode,
} from "@/hooks/postal-code/useCreatePostalCode";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FieldErrors = Partial<
  Record<
    | "regionName"
    | "provinceName"
    | "municipalityName"
    | "zipCode"
    | "postalAreaType",
    string
  >
>;

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

  const [postalAreaName, setPostalAreaName] = useState("");
  const [postalAreaType, setPostalAreaType] = useState("");

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const createPostalCode =
    useCreatePostalCode();

  if (!isOpen) {
    return null;
  }

  const clearFieldError = (
    field: keyof FieldErrors
  ) => {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const resetForm = () => {
    setRegionName("");
    setProvinceName("");
    setMunicipalityName("");
    setZipCode("");
    setPostalAreaName("");
    setPostalAreaType("");
    setErrors({});
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

    setErrors({});

    const result =
      createPostalCodeSchema.safeParse({
        regionName:
          regionName.trim(),

        provinceName:
          provinceName.trim(),

        municipalityName:
          municipalityName.trim(),

        postalAreaName:
           postalAreaName.trim() || undefined,
         postalAreaType:
            postalAreaType || undefined,

        zipCode:
          zipCode.trim(),

        normalizedProvince:
          provinceName
            .trim()
            .toUpperCase(),

        normalizedMunicipality:
          municipalityName
            .trim()
            .toUpperCase(),

        normalizedPostalArea:
          postalAreaName
            .trim()
            .toUpperCase(),

        source: "MANUAL",
      });

    if (!result.success) {
      const fieldErrors =
        result.error.flatten()
          .fieldErrors;

      setErrors({
        regionName:
          fieldErrors.regionName?.[0],

        provinceName:
          fieldErrors.provinceName?.[0],

        municipalityName:
          fieldErrors.municipalityName?.[0],

        zipCode:
          fieldErrors.zipCode?.[0],

      postalAreaType:
          fieldErrors.postalAreaType?.[0],
      });

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

  const getInputClass = (
    hasError: boolean
  ) => `
    w-full
    rounded-xl
    border
    px-4 py-3
    text-sm
    outline-none
    transition
    disabled:bg-gray-100

    ${
      hasError
        ? `
          border-red-500
          bg-red-50/30
          text-red-900
          placeholder:text-red-300
          focus:border-red-500
          focus:ring-4
          focus:ring-red-500/10
        `
        : `
          border-gray-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/10
        `
    }
  `;

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
        {/* Header */}
        <div
          className="
            flex items-center
            justify-between
            border-b
            border-gray-200
            px-6 py-5
          "
        >
          <div
            className="
              flex items-center gap-3
            "
          >
            <div
              className="
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <MapPinPlus
                size={20}
              />
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
                Add an additional
                postal code reference
                manually.
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

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div
            className="
              grid grid-cols-1
              gap-5
              px-6 py-6
              md:grid-cols-2
            "
          >



            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Postal Area
                </label>

                <input
                  type="text"
                  value={postalAreaName}
                  onChange={(e) => setPostalAreaName(e.target.value)}
                  placeholder="e.g. Putatan, Manuyo, Almanza Uno"
                  disabled={createPostalCode.isPending}
                  className="
                    w-full rounded-xl border border-gray-300
                    px-4 py-3 text-sm outline-none transition
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-500/10
                    disabled:bg-gray-100
                  "
                />
              </div>

         <div>
  <label
    htmlFor="postalAreaType"
    className={`
      mb-2 block text-sm font-medium
      ${
        errors.postalAreaType
          ? "text-red-600"
          : "text-gray-700"
      }
    `}
  >
    Postal Area Type

    {postalAreaName.trim() && (
      <span className="ml-1 text-red-500">
        *
      </span>
    )}
  </label>

  <select
    id="postalAreaType"
    value={postalAreaType}
    onChange={(e) => {
      setPostalAreaType(e.target.value);

      // Optional: remove error as soon as
      // the user selects a valid value
      if (
        e.target.value &&
        errors.postalAreaType
      ) {
        setErrors((prev) => ({
          ...prev,
          postalAreaType: undefined,
        }));
      }
    }}
    disabled={createPostalCode.isPending}
    className={`
      w-full rounded-xl border
      px-4 py-3 text-sm
      outline-none transition
      disabled:bg-gray-100
      disabled:cursor-not-allowed

      ${
        errors.postalAreaType
          ? `
            border-red-500
            text-red-900
            focus:border-red-500
            focus:ring-4
            focus:ring-red-500/10
          `
          : `
            border-gray-300
            text-gray-900
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          `
      }
    `}
  >
    <option value="">
      Select type
    </option>

    <option value="BARANGAY">
      Barangay
    </option>

    <option value="SUBDIVISION">
      Subdivision
    </option>

    <option value="VILLAGE">
      Village
    </option>

    <option value="DISTRICT">
      District
    </option>

    <option value="POSTAL_AREA">
      Postal Area
    </option>
  </select>

  {errors.postalAreaType && (
    <p className="mt-1.5 text-xs font-medium text-red-500">
      {errors.postalAreaType}
    </p>
  )}
</div>
            {/* Region */}
            <div>
              <label
                className={`
                  mb-2 block
                  text-sm font-medium
                  ${
                    errors.regionName
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                `}
              >
                Region
                <span
                  className="
                    ml-1 text-red-500
                  "
                >
                  *
                </span>
              </label>

              <input
                type="text"
                value={regionName}
                onChange={(e) => {
                  setRegionName(
                    e.target.value
                  );

                  clearFieldError(
                    "regionName"
                  );
                }}
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. NCR"
                aria-invalid={
                  Boolean(
                    errors.regionName
                  )
                }
                className={getInputClass(
                  Boolean(
                    errors.regionName
                  )
                )}
              />

              {errors.regionName && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {errors.regionName}
                </p>
              )}
            </div>

            {/* Province */}
            <div>
              <label
                className={`
                  mb-2 block
                  text-sm font-medium
                  ${
                    errors.provinceName
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                `}
              >
                Province
                <span
                  className="
                    ml-1 text-red-500
                  "
                >
                  *
                </span>
              </label>

              <input
                type="text"
                value={provinceName}
                onChange={(e) => {
                  setProvinceName(
                    e.target.value
                  );

                  clearFieldError(
                    "provinceName"
                  );
                }}
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. Metro Manila"
                aria-invalid={
                  Boolean(
                    errors.provinceName
                  )
                }
                className={getInputClass(
                  Boolean(
                    errors.provinceName
                  )
                )}
              />

              {errors.provinceName && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {
                    errors.provinceName
                  }
                </p>
              )}
            </div>

            {/* Municipality */}
            <div>
              <label
                className={`
                  mb-2 block
                  text-sm font-medium
                  ${
                    errors.municipalityName
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                `}
              >
                Municipality / City
                <span
                  className="
                    ml-1 text-red-500
                  "
                >
                  *
                </span>
              </label>

              <input
                type="text"
                value={
                  municipalityName
                }
                onChange={(e) => {
                  setMunicipalityName(
                    e.target.value
                  );

                  clearFieldError(
                    "municipalityName"
                  );
                }}
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. Muntinlupa"
                aria-invalid={
                  Boolean(
                    errors.municipalityName
                  )
                }
                className={getInputClass(
                  Boolean(
                    errors.municipalityName
                  )
                )}
              />

              {errors.municipalityName && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {
                    errors.municipalityName
                  }
                </p>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label
                className={`
                  mb-2 block
                  text-sm font-medium
                  ${
                    errors.zipCode
                      ? "text-red-600"
                      : "text-gray-700"
                  }
                `}
              >
                ZIP Code
                <span
                  className="
                    ml-1 text-red-500
                  "
                >
                  *
                </span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(
                    e.target.value
                  );

                  clearFieldError(
                    "zipCode"
                  );
                }}
                disabled={
                  createPostalCode.isPending
                }
                placeholder="e.g. 1770"
                aria-invalid={
                  Boolean(
                    errors.zipCode
                  )
                }
                className={getInputClass(
                  Boolean(
                    errors.zipCode
                  )
                )}
              />

              {errors.zipCode && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {errors.zipCode}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
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