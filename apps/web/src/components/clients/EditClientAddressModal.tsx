"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  MapPin,
  Save,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  ClientPostalAuditItem,
  updateClientAddressSchema,
} from "@repo/shared";

import { useUpdateClientAddress } from "@/hooks/clients/useUpdateClientAddress";

type Props = {
  isOpen: boolean;
  client: ClientPostalAuditItem | null;
  branchId: string;
  onClose: () => void;
};

export default function EditClientAddressModal({
  isOpen,
  client,
  branchId,
  onClose,
}: Props) {
  const [address, setAddress] =
    useState("");

  const updateClientAddress =
    useUpdateClientAddress(branchId);

  useEffect(() => {
    if (client) {
      setAddress(
        client.address ?? ""
      );
    }
  }, [client]);

  if (!isOpen || !client) {
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result =
      updateClientAddressSchema.safeParse({
        id: client.clientId,
        address,
      });

    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message ??
          "Invalid input."
      );

      return;
    }

    try {
      await updateClientAddress.mutateAsync(
        result.data
      );

      toast.success(
        "Client address updated successfully."
      );

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update address."
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
          w-full max-w-xl
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
              <MapPin size={20} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                Edit Client Address
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Update the client's
                current address.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              updateClientAddress.isPending
            }
            className="
              rounded-lg
              p-2
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
        >
          <div
            className="
              space-y-5
              px-6 py-6
            "
          >
            <div>
              <label
                htmlFor="address"
                className="
                  mb-2 block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Address
                <span
                  className="
                    ml-1
                    text-red-500
                  "
                >
                  *
                </span>
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="
                  Enter complete client address
                "
                disabled={
                  updateClientAddress.isPending
                }
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-300
                  px-4 py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:bg-gray-100
                "
              />

              <div
                className="
                  mt-2
                  flex
                  justify-between
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Enter the complete
                  and corrected address.
                </p>

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {address.length}
                  {" "}
                  characters
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              flex items-center
              justify-end
              gap-3
              border-t
              border-gray-200
              bg-gray-50
              px-6 py-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={
                updateClientAddress.isPending
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
                updateClientAddress.isPending
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

              {updateClientAddress.isPending
                ? "Updating..."
                : "Update Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}