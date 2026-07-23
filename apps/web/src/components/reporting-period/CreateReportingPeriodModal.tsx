"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCreateReportingPeriod } from "@/hooks/reporting-period/useCreateReportingPeriod";



interface CreateReportingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function CreateReportingPeriodModal({
  isOpen,
  onClose,
}: CreateReportingPeriodModalProps) {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  const [errorMessage, setErrorMessage] =
    useState("");

  const createReportingPeriod =
    useCreateReportingPeriod();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
    setErrorMessage("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await createReportingPeriod.mutateAsync({
        month,
        year,
      });

      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create reporting period."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-reporting-period-title"
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="create-reporting-period-title"
              className="text-lg font-semibold text-gray-900"
            >
              Create Reporting Period
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the month and year for the
              reporting period.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              createReportingPeriod.isPending
            }
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="reporting-month"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Month
              </label>

              <select
                id="reporting-month"
                value={month}
                onChange={(event) =>
                  setMonth(
                    Number(event.target.value)
                  )
                }
                disabled={
                  createReportingPeriod.isPending
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {months.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reporting-year"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Year
              </label>

              <input
                id="reporting-year"
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(event) =>
                  setYear(
                    Number(event.target.value)
                  )
                }
                disabled={
                  createReportingPeriod.isPending
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createReportingPeriod.isPending
              }
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createReportingPeriod.isPending
              }
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createReportingPeriod.isPending
                ? "Creating..."
                : "Create Period"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}