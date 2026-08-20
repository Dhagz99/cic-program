"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  MapPin,
} from "lucide-react";

import { useGetPostalCode } from "@/hooks/postal-code/useGetPostalCode";

type PostalCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PostalCodeModal({
  isOpen,
  onClose,
}: PostalCodeModalProps) {
  const [search, setSearch] = useState("");

  const {
    data: postalCodes = [],
    isLoading,
    isError,
  } = useGetPostalCode();

  const filteredPostalCodes = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return postalCodes;
    }

    return postalCodes.filter(
      (postalCode) =>
        postalCode.normalizedProvince
          ?.toLowerCase()
          .includes(keyword) ||
        postalCode.normalizedMunicipality
          ?.toLowerCase()
          .includes(keyword) ||
        postalCode.normalizedPostalArea
          ?.toLowerCase()
          .includes(keyword) ||
        postalCode.zipCode
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [postalCodes, search]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/45
        px-4 py-6
        backdrop-blur-[1px]
      "
    >
      <div
        className="
          flex
          h-[88vh]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          rounded-xl
          border border-gray-200
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-6
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                bg-blue-50
                text-blue-600
              "
            >
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Postal Codes
              </h2>

              <p className="text-sm text-gray-500">
                Philippine postal code reference
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close postal code modal"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-gray-100
            bg-gray-50/70
            px-6
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search province, municipality, area, ZIP..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                pl-10
                pr-4
                text-sm
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">
              {filteredPostalCodes.length}
            </span>{" "}
            records
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 p-6">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-11
                    animate-pulse
                    rounded-lg
                    bg-gray-100
                  "
                />
              ))}
            </div>
          )}

          {isError && (
            <div
              className="
                flex h-full
                items-center justify-center
              "
            >
              <div className="text-center">
                <p className="font-medium text-red-600">
                  Failed to load postal codes.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Please try again later.
                </p>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredPostalCodes.length === 0 && (
              <div
                className="
                  flex h-full
                  items-center justify-center
                "
              >
                <div className="text-center">
                  <Search
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-medium text-gray-700">
                    No postal codes found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Try using a different search term.
                  </p>
                </div>
              </div>
            )}

          {!isLoading &&
            !isError &&
            filteredPostalCodes.length > 0 && (
              <div
                className="
                  h-full
                  overflow-auto
                  rounded-lg
                  border
                  border-gray-200
                "
              >
                <table className="min-w-full border-collapse">
                  <thead
                    className="
                      sticky
                      top-0
                      z-10
                      bg-gray-50
                    "
                  >
                    <tr className="border-b border-gray-200">
                      <th
                        className="
                          px-5 py-3.5
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Province
                      </th>

                      <th
                        className="
                          px-5 py-3.5
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Municipality
                      </th>

                      <th
                        className="
                          px-5 py-3.5
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Postal Area
                      </th>

                      <th
                        className="
                          w-32
                          px-5 py-3.5
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        ZIP Code
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredPostalCodes.map(
                      (postalCode) => (
                        <tr
                          key={postalCode.id}
                          className="
                            bg-white
                            transition-colors
                            hover:bg-blue-50/40
                          "
                        >
                          <td
                            className="
                              px-5 py-3.5
                              text-sm
                              font-medium
                              text-gray-700
                            "
                          >
                            {
                              postalCode.normalizedProvince
                            }
                          </td>

                          <td
                            className="
                              px-5 py-3.5
                              text-sm
                              text-gray-700
                            "
                          >
                            {
                              postalCode.normalizedMunicipality
                            }
                          </td>

                          <td
                            className="
                              px-5 py-3.5
                              text-sm
                              text-gray-600
                            "
                          >
                            {postalCode.normalizedPostalArea ||
                              (
                                <span className="text-gray-300">
                                  —
                                </span>
                              )}
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className="
                                inline-flex
                                rounded-md
                                bg-blue-50
                                px-2.5
                                py-1
                                font-mono
                                text-sm
                                font-semibold
                                text-blue-700
                              "
                            >
                              {postalCode.zipCode}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-gray-200
            bg-gray-50/50
            px-6
            py-3
          "
        >
          <p className="text-xs text-gray-500">
            {postalCodes.length} total postal code references
          </p>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              shadow-sm
              transition
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-blue-100
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}