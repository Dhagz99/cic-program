import { ContractExportValidationError } from "@repo/shared";
import { AlertTriangle, Pencil, X } from "lucide-react";

type ValidationErrorModalProps = {
  isOpen: boolean;
  errors: ContractExportValidationError[];
  onClose: () => void;
  onEditLoan: (id: string) => void;
};

export function LoanValidationErrorModal({
  isOpen,
  errors,
  onClose,
  onEditLoan,
}: ValidationErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b bg-white px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contract Validation Errors
                </h2>

                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                  {errors.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Correct the following contracts before generating the export file.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary */}
        <div className="border-b bg-red-50/50 px-6 py-3">
          <p className="text-sm text-red-700">
            Export cannot continue until all listed validation errors are resolved.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="w-[160px] px-4 py-3">
                    Account No.
                  </th>

                  <th className="w-[160px] px-4 py-3">
                    Contract No.
                  </th>

                  <th className="px-4 py-3">
                    Validation Error
                  </th>

                  <th className="w-[100px] px-4 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {errors.map((item, index) => (
                  <tr
                    key={`${item.id}-${index}`}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
                      {item.providerSubjectNo}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                      {item.accountNo}
                    </td>

                    <td className="px-4 py-4">
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {item.error}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onEditLoan(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500">
            {errors.length} validation error
            {errors.length !== 1 ? "s" : ""} found
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}