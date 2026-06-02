"use client";

import { useState } from "react";

import {
   Download,
   Eye,
   Filter,
   Pencil,
   Plus,
   Search,
   Trash2,
   WalletCards,
} from "lucide-react";
import { useClientLoan } from "@/hooks/loans/useLoans";
import { formatNumber } from "@/utils/value/formatNumber";
import { formatCompactCurrency } from "@/utils/value/formatCompactCurrency";


  
export default function Loans() {

  const [
     page,
     setPage
  ] = useState(1);

  const [
     search,
     setSearch
  ] = useState("");

  const [
     contractPhase,
     setContractPhase
  ] = useState("");

  const {

     loans,

     total,
     summary,

     totalPages,

     isLoading,

  } = useClientLoan({

     page,

     limit: 10,

     search,

     contractPhase:
        contractPhase || undefined

  });


    return (
      <div className="p-8 bg-slate-100 min-h-screen flex flex-col gap-7">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Loan Management
            </h1>
  
            <p className="text-slate-500 mt-1">
              Manage borrower loan contracts and CI
              records
            </p>
          </div>
  
          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              className="
                h-11 px-5 rounded-2xl
                border border-slate-200
                bg-white hover:bg-slate-100
                transition
                flex items-center gap-2
                text-sm font-medium text-slate-700
              "
            >
              <Download size={18} />
  
              Export
            </button>
  
            <button
              className="
                h-11 px-5 rounded-2xl
                bg-blue-600 hover:bg-blue-700
                transition
                flex items-center gap-2
                text-sm font-medium text-white
                shadow-lg shadow-blue-500/20
              "
            >
              <Plus size={18} />
  
              Add Loan
            </button>
          </div>
        </div>
  
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Total Loans
                </p>
  
                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                  {formatNumber(total)}
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <WalletCards
                  className="text-blue-600"
                  size={28}
                />
              </div>
            </div>
          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div>
              <p className="text-slate-500 text-sm">
                Active Loans
              </p>
  
              <h2 className="text-3xl font-bold text-slate-800 mt-3">
                {formatNumber(summary.activeLoans)}
              </h2>
            </div>
          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div>
              <p className="text-slate-500 text-sm">
                Overdue Loans
              </p>
  
              <h2 className="text-3xl font-bold text-red-600 mt-3">
                {formatNumber(summary.pastDueLoans)}
              </h2>
            </div>
          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div>
              <p className="text-slate-500 text-sm">
                Total Loan Amount
              </p>
  
              <h2 className="text-3xl font-bold text-slate-800 mt-3">
                {formatCompactCurrency(summary.totalLoanAmount)}
              </h2>
            </div>
          </div>
        </div>
  
        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* TOP */}
          <div className="p-6 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* SEARCH */}
            <div className="relative w-full xl:w-87.5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
  
                  <input
                  type="text"
                  placeholder="Search contract no..."
                  value={search}
                  onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                  }
                  className="
                      w-full h-11 rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      pl-11 pr-4
                      text-sm
                      outline-none
                      focus:ring-2 focus:ring-blue-500
                      focus:border-blue-500
                  "
                />
            </div>
  
            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="
                  h-11 px-4 rounded-2xl
                  border border-slate-200
                  bg-white
                  text-sm text-slate-700
                  outline-none
                "
              >
                <option>All Branches</option>
              </select>
  
              <select
                  value={contractPhase}
                  onChange={(e) =>
                      setContractPhase(
                        e.target.value
                      )
                  }
                  className="
                      h-11 px-4 rounded-2xl
                      border border-slate-200
                      bg-white
                      text-sm text-slate-700
                      outline-none
                  "
                >
                  <option value="">
                      All Status
                  </option>

                  <option value="AC">
                      Active
                  </option>

                  <option value="CL">
                      Closed
                  </option>
                </select>
  
              <button
                className="
                  h-11 px-4 rounded-2xl
                  border border-slate-200
                  bg-white hover:bg-slate-100
                  transition
                  flex items-center gap-2
                  text-sm font-medium
                "
              >
                <Filter size={18} />
  
                Filters
              </button>
            </div>
          </div>
  
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* HEAD */}
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Contract No
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Borrower
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Loan Amount
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Balance
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Start Date
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    End Date
                  </th>
  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
  
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
  
              {/* BODY */}
              <tbody>

{
   isLoading ? (

      <tr>

         <td
            colSpan={8}
            className="
               text-center
               py-10
            "
         >

            Loading...

         </td>

      </tr>

   ) : loans.length === 0 ? (

      <tr>

         <td
            colSpan={8}
            className="
               text-center
               py-10
            "
         >

            No loans found

         </td>

      </tr>

   ) : (

      loans.map((loan) => (

         <tr
            key={loan.id}
            className="
               border-t
               border-slate-100
               hover:bg-slate-50
               transition
            "
         >

            <td className="px-6 py-4 text-sm font-semibold text-slate-800">

               {loan.contractNo}

            </td>

            <td className="px-6 py-4">

               <div>

                  <p className="text-sm font-semibold text-slate-800">

                     {loan.client.lastName},
                     {" "}
                     {loan.client.firstName}

                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                     {loan.client.providerSubjectNo}

                  </p>

               </div>

            </td>

            <td className="px-6 py-4 text-sm text-slate-700">

               ₱
               {
                  Number(
                     loan.financedAmount
                  ).toLocaleString()
               }

            </td>

            <td className="px-6 py-4 text-sm text-slate-700">

               ₱
               {
                  Number(
                     loan.outstandingBalance
                  ).toLocaleString()
               }

            </td>

            <td className="px-6 py-4 text-sm text-slate-700">

               {
                  loan.contractStartDate

                     ? new Date(
                        loan.contractStartDate
                     ).toLocaleDateString()

                     : "-"
               }

            </td>

            <td className="px-6 py-4 text-sm text-slate-700">

               {
                  loan.contractEndPlannedDate

                     ? new Date(
                        loan.contractEndPlannedDate
                     ).toLocaleDateString()

                     : "-"
               }

            </td>

            <td className="px-6 py-4">

               <span
                  className={`
                     px-3 py-1 rounded-full text-xs font-medium
                     ${
                        loan.contractPhase === "AC"
                           ? "bg-green-100 text-green-700"
                           : "bg-slate-100 text-slate-700"
                     }
                  `}
               >

                  {loan.contractPhase}

               </span>

            </td>

            <td className="px-6 py-4">

               <div className="
                  flex
                  items-center
                  justify-end
                  gap-2
               ">

                  <button
                     className="
                        w-10 h-10 rounded-xl
                        bg-slate-100 hover:bg-slate-200
                        transition
                        flex items-center justify-center
                        text-slate-700
                     "
                  >
                     <Eye size={18} />
                  </button>

                  <button
                     className="
                        w-10 h-10 rounded-xl
                        bg-blue-100 hover:bg-blue-200
                        transition
                        flex items-center justify-center
                        text-blue-700
                     "
                  >
                     <Pencil size={18} />
                  </button>

                  <button
                     className="
                        w-10 h-10 rounded-xl
                        bg-red-100 hover:bg-red-200
                        transition
                        flex items-center justify-center
                        text-red-700
                     "
                  >
                     <Trash2 size={18} />
                  </button>

               </div>

            </td>

         </tr>

      ))

   )
}

</tbody>
            </table>
          </div>
  
          {/* PAGINATION */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
            Showing {loans.length} of {total.toLocaleString()} loans
            </p>
  
            <div className="flex items-center gap-2">
                      {
            Array.from(
                {
                  length: totalPages
                },
                (_, index) => (

                  <button

                      key={index + 1}

                      onClick={() =>
                        setPage(
                            index + 1
                        )
                      }

                      className={`
                        w-10 h-10 rounded-xl
                        border border-slate-200
                        transition
                        ${
                            page === index + 1

                              ? "bg-blue-600 text-white"

                              : "hover:bg-slate-100"
                        }
                      `}
                  >

                      {index + 1}

                  </button>

                )
            )
          }
            </div>
          </div>
        </div>
      </div>
    );
  }