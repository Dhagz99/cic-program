import type {
  ClientPostalAuditItem
} from "@repo/shared";
import PostalStatusBadge from "./PostalStatusBadge";



type Props = {
  rows: ClientPostalAuditItem[];
  selectedIds: Set<string>;
  isUpdating: boolean;

  onToggleRow: (
    clientId: string
  ) => void;
};

export default function PostalAuditTable({
  rows,
  selectedIds,
  isUpdating,
  onToggleRow
}: Props) {
  if (rows.length === 0) {
    return (
      <div
        className="
          flex min-h-56
          items-center justify-center
          p-8 text-center
        "
      >
        <div>
          <p
            className="
              font-medium
              text-slate-900
            "
          >
            No records found
          </p>

          <p
            className="
              mt-1 text-sm
              text-slate-500
            "
          >
            Try changing the search or status
            filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="
          min-w-[1200px]
          w-full text-sm
        "
      >
        <thead
          className="
            bg-slate-50
            text-xs font-semibold
            uppercase
            tracking-wide
            text-slate-500
          "
        >
          <tr>
            <th className="w-16 px-5 py-4 text-left">
              Select
            </th>

            <th className="px-5 py-4 text-left">
              Client
            </th>

            <th className="px-5 py-4 text-left">
              Address
            </th>

            <th className="px-5 py-4 text-left">
              Current ZIP
            </th>

            <th className="px-5 py-4 text-left">
              Detected ZIP
            </th>

            <th className="px-5 py-4 text-left">
              Matched Location
            </th>

            <th className="px-5 py-4 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => {
            const isFixable =
              (
                item.status === "MISSING" ||
                item.status === "MISMATCH"
              ) &&
              Boolean(
                item.detectedPostalCode
              );

            return (
              <tr
                key={item.clientId}
                className="
                  border-t
                  border-slate-200
                  align-top
                  transition
                  hover:bg-slate-50/70
                "
              >
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    disabled={
                      !isFixable ||
                      isUpdating
                    }
                    checked={selectedIds.has(
                      item.clientId
                    )}
                    onChange={() =>
                      onToggleRow(
                        item.clientId
                      )
                    }
                    className="
                      h-4 w-4
                      rounded
                      border-slate-300
                      text-blue-600
                      focus:ring-blue-500
                      disabled:opacity-40
                    "
                  />
                </td>

                <td className="px-5 py-4">
                  <p
                    className="
                      font-medium
                      text-slate-900
                    "
                  >
                    {item.clientName ||
                      "-"}
                  </p>

                  <p
                    className="
                      mt-1 text-xs
                      text-slate-500
                    "
                  >
                    ID:{" "}
                    {item.providerSubjectNo ??
                      "-"}
                  </p>
                </td>

                <td
                  className="
                    max-w-md
                    px-5 py-4
                    text-slate-700
                  "
                >
                  {item.address ?? "-"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className="
                      inline-flex
                      min-w-16
                      justify-center
                      rounded-lg
                      bg-slate-100
                      px-3 py-1.5
                      font-medium
                      text-slate-700
                    "
                  >
                    {item.currentPostalCode ??
                      "-"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`
                      inline-flex
                      min-w-16
                      justify-center
                      rounded-lg
                      px-3 py-1.5
                      font-semibold
                      ${
                        item.detectedPostalCode
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {item.detectedPostalCode ??
                      "-"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {item.matchedMunicipality ? (
                    <>
                      <p
                        className="
                          font-medium
                          text-slate-900
                        "
                      >
                        {
                          item.matchedMunicipality
                        }
                      </p>

                      <p
                        className="
                          mt-1 text-xs
                          text-slate-500
                        "
                      >
                        {item.matchedProvince ??
                          "-"}
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-5 py-4">
                  <PostalStatusBadge
                    status={item.status}
                  />

                  <p
                    className="
                      mt-2 max-w-xs
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    {item.message}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}