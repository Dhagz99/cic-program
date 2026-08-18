"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  CheckCircle2,
  MapPin,
  MapPinPlus,
  RefreshCw,
  Save,
  Search,
  TriangleAlert,
  XCircle
} from "lucide-react";



import type {
  ClientPostalAuditItem
} from "@repo/shared";

import {
  usePostalCodeAudit,
  useUpdatePostalCodes
} from "@/hooks/postal-code/usePostalCodeAudit";

import {
  useGetBranches
} from "@/hooks/useGeneral";


import { toast } from "sonner";
import PostalAuditSummary from "./PostalAuditSummary";
import PostalAuditTable from "./PostalAuditTable";
import { useAuth } from "../context/UserContext";
import { useUpdateClientAddress } from "@/hooks/clients/useUpdateClientAddress";
import EditClientAddressModal from "../clients/EditClientAddressModal";
import AddPostalCodeModal from "./AddPostalCodeModal";

type StatusFilter =
  | "ALL"
  | "CORRECT"
  | "MISSING"
  | "MISMATCH"
  | "UNRESOLVED";

export default function PostalCodeMaintenance() {

  const [
    branchId,
    setBranchId
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter
  ] = useState<StatusFilter>("ALL");

  const [
    search,
    setSearch
  ] = useState("");

    const [
      selectedClient,
      setSelectedClient,
    ] =
      useState<ClientPostalAuditItem | null>(
        null
      );

  const [
    selectedIds,
    setSelectedIds
  ] = useState<Set<string>>(
    new Set()
  );


  const [isAddPostalCodeOpen, setIsAddPostalCodeOpen] = useState(false);
  const user = useAuth();

const isAdmin =
   user.hasRole("ADMIN")


  const {
    data: branches = [],
    isLoading: isBranchesLoading
  } = useGetBranches();

  const {
    data: audit,
    isLoading,
    isFetching,
    refetch
  } = usePostalCodeAudit(branchId);

  const updateMutation =
    useUpdatePostalCodes(branchId);


   const updateClientAddressMutation = useUpdateClientAddress(branchId); 

  useEffect(() => {
    setSelectedIds(new Set());
    setSearch("");
    setStatusFilter("ALL");
  }, [branchId]);

  const visibleBranches = isAdmin
   ? branches
   : branches.filter(
        (branch) => branch.id === user.user?.branchId
     );




useEffect(() => {
   if (!user) return;

   if (!isAdmin && user.user?.branchId) {
      setBranchId(user.user?.branchId);
   }
}, [user, isAdmin]);

  const filteredRows =
    useMemo(() => {
      const rows =
        audit?.data ?? [];

      return rows.filter((item) => {
        const matchesStatus =
          statusFilter === "ALL" ||
          item.status === statusFilter;

        const keyword =
          search.trim().toLowerCase();

        const matchesSearch =
          !keyword ||
          item.clientName
            .toLowerCase()
            .includes(keyword) ||
          item.providerSubjectNo
            ?.toLowerCase()
            .includes(keyword) ||
          item.address
            ?.toLowerCase()
            .includes(keyword) ||
          item.detectedPostalCode
            ?.includes(keyword) ||
          item.currentPostalCode
            ?.includes(keyword);

        return (
          matchesStatus &&
          matchesSearch
        );
      });
    }, [
      audit?.data,
      search,
      statusFilter
    ]);

  const fixableRows =
    useMemo(() => {
      return (
        audit?.data.filter(
          (item) =>
            (
              item.status === "MISSING" ||
              item.status === "MISMATCH"
            ) &&
            Boolean(
              item.detectedPostalCode
            )
        ) ?? []
      );
    }, [audit?.data]);

  const selectedRows =
    useMemo(() => {
      return fixableRows.filter(
        (item) =>
          selectedIds.has(
            item.clientId
          )
      );
    }, [
      fixableRows,
      selectedIds
    ]);

  const allVisibleFixableRows =
    useMemo(() => {
      return filteredRows.filter(
        (item) =>
          (
            item.status === "MISSING" ||
            item.status === "MISMATCH"
          ) &&
          Boolean(
            item.detectedPostalCode
          )
      );
    }, [filteredRows]);

  const isAllVisibleSelected =
    allVisibleFixableRows.length > 0 &&
    allVisibleFixableRows.every(
      (item) =>
        selectedIds.has(
          item.clientId
        )
    );

  const toggleRow = (
    clientId: string
  ) => {
    setSelectedIds((current) => {
      const next =
        new Set(current);

      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }

      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelectedIds((current) => {
      const next =
        new Set(current);

      if (isAllVisibleSelected) {
        for (
          const item of allVisibleFixableRows
        ) {
          next.delete(item.clientId);
        }
      } else {
        for (
          const item of allVisibleFixableRows
        ) {
          next.add(item.clientId);
        }
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const updateRows = async (
    rows: ClientPostalAuditItem[]
  ) => {
    if (rows.length === 0) {
      toast.error(
        "No valid records selected."
      );

      return;
    }

    try {
      const response =
        await updateMutation.mutateAsync({
          items: rows.map((item) => ({
            clientId:
              item.clientId,

            postalCode:
              item.detectedPostalCode!
          }))
        });

      toast.success(
        response.message ??
        `${rows.length} postal codes updated.`
      );

      clearSelection();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
        error?.message ??
        "Unable to update postal codes."
      );
    }
  };


  const handleCheck = async () => {
    if (!branchId) {
      toast.error(
        "Select a branch first."
      );

      return;
    }

    await refetch();
  };


  const handleEditAddress = (
  data: ClientPostalAuditItem
) => {
  if (!branchId) {
    toast.error(
      "Select a branch first."
    );

    return;
  }

  setSelectedClient(data);
};

  return (
    <div className="space-y-6 p-6">
      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl font-semibold
              text-slate-900
            "
          >
            Postal Code Maintenance
          </h1>

          <p
            className="
              mt-1 text-sm
              text-slate-500
            "
          >
            Check client addresses by branch and update
            missing or incorrect postal codes.
          </p>
        </div>
    <div className="flex gap-2">
 <button
          type="button"
          disabled={
            !branchId ||
            isFetching
          }
          onClick={handleCheck}
          className="
            inline-flex h-11
            items-center justify-center
            gap-2 rounded-xl
            bg-blue-600 px-5
            text-sm font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            className={`
              h-4 w-4
              ${
                isFetching
                  ? "animate-spin"
                  : ""
              }
            `}
          />

          {isFetching
            ? "Checking..."
            : "Check Postal Codes"}
        </button>
        {isAdmin && (
        <button
            type="button"
            onClick={() =>
              setIsAddPostalCodeOpen(true)
            }
            className="
              inline-flex items-center gap-2
              rounded-lg
              bg-green-600
              px-4 py-2.5
              text-sm font-medium
              text-white
              hover:bg-green-700
            "
          >
            <MapPinPlus size={17} />
            Add Postal Code
          </button>
        )}
        
    </div>
       
      </div>

      <div
        className="
          rounded-2xl
          border border-slate-200
          bg-white p-5
          shadow-sm
        "
      >
        <div
          className="
            grid gap-4
            lg:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)_220px]
          "
        >
          <div>
            <label
              className="
                mb-2 block
                text-sm font-medium
                text-slate-700
              "
            >
              Branch
            </label>

            <select
              value={branchId}
              disabled={
                isBranchesLoading
              }
              onChange={(event) =>
                setBranchId(
                  event.target.value
                )
              }
              className="
                h-11 w-full
                rounded-xl
                border border-slate-300
                bg-white px-3
                text-sm text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {isAdmin && (
                <option value="">
                  Select Branch
                </option>
              )}
               {visibleBranches.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.branchName ??
                      branch.branchName}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              className="
                mb-2 block
                text-sm font-medium
                text-slate-700
              "
            >
              Search
            </label>

            <div className="relative">
              <Search
                className="
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                disabled={!audit}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search client, address or ZIP code..."
                className="
                  h-11 w-full
                  rounded-xl
                  border border-slate-300
                  pl-10 pr-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-50
                "
              />
            </div>
          </div>

          <div>
            <label
              className="
                mb-2 block
                text-sm font-medium
                text-slate-700
              "
            >
              Status
            </label>

            <select
              value={statusFilter}
              disabled={!audit}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className="
                h-11 w-full
                rounded-xl
                border border-slate-300
                bg-white px-3
                text-sm text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              <option value="ALL">
                All statuses
              </option>

              <option value="CORRECT">
                Correct
              </option>

              <option value="MISSING">
                Missing
              </option>

              <option value="MISMATCH">
                Mismatch
              </option>

              <option value="UNRESOLVED">
                Unresolved
              </option>
            </select>
          </div>
        </div>
      </div>

      {!branchId && (
        <div
          className="
            flex min-h-64
            flex-col items-center
            justify-center
            rounded-2xl
            border border-dashed
            border-slate-300
            bg-white p-10
            text-center
          "
        >
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-blue-50
            "
          >
            <MapPin
              className="
                h-7 w-7
                text-blue-600
              "
            />
          </div>

          <h2
            className="
              mt-4 text-lg
              font-semibold
              text-slate-900
            "
          >
            Select a branch
          </h2>

          <p
            className="
              mt-2 max-w-md
              text-sm text-slate-500
            "
          >
            Choose a branch to check the client
            postal-code records.
          </p>
        </div>
      )}

      {branchId && isLoading && (
        <div
          className="
            flex min-h-64
            items-center justify-center
            rounded-2xl
            border border-slate-200
            bg-white
          "
        >
          <div className="text-center">
            <RefreshCw
              className="
                mx-auto h-7 w-7
                animate-spin
                text-blue-600
              "
            />

            <p
              className="
                mt-3 text-sm
                text-slate-500
              "
            >
              Checking postal-code records...
            </p>
          </div>
        </div>
      )}

      {audit && !isLoading && (
        <>
          <PostalAuditSummary
            summary={audit.summary}
          />

          <div
            className="
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white shadow-sm
            "
          >
            <div
              className="
                flex flex-col gap-3
                border-b border-slate-200
                p-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Client Postal Code Audit
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-slate-500
                  "
                >
                  Showing {filteredRows.length} of{" "}
                  {audit.summary.total} clients
                </p>
              </div>

              <div
                className="
                  flex flex-wrap
                  items-center gap-2
                "
              >
                <button
                  type="button"
                  disabled={
                    allVisibleFixableRows.length ===
                    0
                  }
                  onClick={toggleAllVisible}
                  className="
                    h-10 rounded-xl
                    border border-slate-300
                    bg-white px-4
                    text-sm font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isAllVisibleSelected
                    ? "Unselect visible"
                    : "Select visible"}
                </button>

                <button
                  type="button"
                  disabled={
                    selectedIds.size === 0
                  }
                  onClick={clearSelection}
                  className="
                    h-10 rounded-xl
                    border border-slate-300
                    bg-white px-4
                    text-sm font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Clear
                </button>

                <button
                  type="button"
                  disabled={
                    selectedRows.length ===
                      0 ||
                    updateMutation.isPending
                  }
                  onClick={() =>
                    updateRows(
                      selectedRows
                    )
                  }
                  className="
                    inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    bg-blue-600 px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Save className="h-4 w-4" />

                  Update selected (
                  {selectedRows.length})
                </button>

                <button
                  type="button"
                  disabled={
                    fixableRows.length ===
                      0 ||
                    updateMutation.isPending
                  }
                  onClick={() =>
                    updateRows(
                      fixableRows
                    )
                  }
                  className="
                    inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    bg-emerald-600 px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-emerald-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <CheckCircle2
                    className="h-4 w-4"
                  />

                  Update all valid
                </button>
              </div>
            </div>

            <PostalAuditTable
              rows={filteredRows}
              selectedIds={selectedIds}
              onToggleRow={toggleRow}
              isUpdating={
                updateMutation.isPending
              }
              onDoubleClickRow={handleEditAddress}
            />

            <EditClientAddressModal
                isOpen={!!selectedClient}
                client={selectedClient}
                branchId={branchId}
                onClose={() =>
                  setSelectedClient(null)
                }  
              />
              <AddPostalCodeModal
                  isOpen={isAddPostalCodeOpen}
                  onClose={() =>
                    setIsAddPostalCodeOpen(false)
                  }
                />
          </div>
        </>
      )}
    </div>
  );
}