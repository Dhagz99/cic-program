"use client";

import { useAuth } from "@/components/context/UserContext";
import UploadDbfModal from "@/components/initialize/UploadDbfModal";
import RequestModal from "@/components/Modal";
import { useInitialize } from "@/hooks/initialize/useInitialize";
import { useLastImport } from "@/hooks/initialize/useInitialize";
import { formatReportingPeriod } from "@/utils/date/formatReportingPerion";
import { ImportBatchItem } from "@repo/shared";
import { Eye, Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const [uploadDBF, setUploadDBF] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const { data: batch } = useLastImport();

  const {
    data,
    isLoading,
    isError,
  } = useInitialize({
    page,
    limit,
    search,
  });

  const batches = data?.data ?? [];
  const pagination = data?.pagination;

  const {hasPermission} =useAuth()

  useEffect(() => {
    if (batch?.id) {
      router.push(`/cic/batches/${batch.id}/review`);
    }
  }, [batch, router]);

  return (
    <div className="p-8 bg-slate-100 min-h-screen flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Initialize Batch
          </h1>

          <p className="mt-1 text-slate-500">
            Create a reporting batch, import source files, and prepare records
            for CIC processing.
          </p>
        </div>
        {
          hasPermission("STAGING_UPLOAD") && (

          <button
            className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20"
            onClick={() => setUploadDBF(true)}
          >
            <Plus size={18} />
            Upload DBF
          </button>
          )
        }

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="relative w-full xl:w-87.5">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search file name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 transition flex items-center gap-2 text-sm font-medium">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  File Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Branch
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Total Records
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                   Reporting Period
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Created At
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-red-600">
                    Failed to load import batches
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    No import batches found
                  </td>
                </tr>
              ) : (
                batches.map((batch: ImportBatchItem) => (
                  <tr
                    key={batch.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {batch.fileName ?? ""}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {batch.branch?.branchName ?? "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {Number(batch.totalRecords ?? 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {
                        formatReportingPeriod(Number(batch.reportingPeriod.month), Number(batch.reportingPeriod.year))
                     }
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {batch.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {batch.createdAt
                        ? new Date(batch.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            router.push(`/cic/batches/${batch.id}/review`)
                          }
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-slate-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {batches.length} of {pagination?.total ?? 0} batches
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="h-10 px-4 rounded-xl border border-slate-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
            </span>

            <button
              disabled={page >= (pagination?.totalPages ?? 1)}
              onClick={() => setPage((prev) => prev + 1)}
              className="h-10 px-4 rounded-xl border border-slate-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {uploadDBF && (
        <RequestModal
          size="xxxl"
          title="Upload"
          onClose={() => setUploadDBF(false)}
        >
          <UploadDbfModal />
        </RequestModal>
      )}
    </div>
  );
}