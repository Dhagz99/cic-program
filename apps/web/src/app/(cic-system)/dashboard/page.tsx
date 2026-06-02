"use client"

import GrowthIndicator from "@/components/dashboard/GrowthIndicatorProps";
import LoanAnalyticsChart from "@/components/dashboard/LoanAnalyticsChart";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { getCurrentDate } from "@/utils/date/getCurrentDate";
import { formatCompactCurrency } from "@/utils/value/formatCompactCurrency";
import { formatNumber } from "@/utils/value/formatNumber";
import {
    Users,
    CreditCard,
    FileSpreadsheet,
    TrendingUp,
    ArrowUpRight,
  } from "lucide-react";
  
  export default function Dashboard() {

    const {data} = useDashboard();
    const borrowerGrowth  = data?.data.borrowerGrowth ?? 0;
    const activeLoanGrowth  = data?.data.activeLoanGrowth ?? 0;
    const loanAmountGrowth  = data?.data.loanAmountGrowth ?? 0;
    
    return (
      <div className="p-8 bg-slate-100 min-h-screen flex flex-col gap-7">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>
  
            <p className="text-slate-500 mt-1">
              Welcome back to CIC Reporting System
            </p>
          </div>
  
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
            <p className="text-sm text-slate-500">
              Todays Date
            </p>
  
            <p className="font-semibold text-slate-800">
              {getCurrentDate()}
            </p>
          </div>
        </div>
  
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Total Borrowers
                </p>
  
                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                  {formatNumber(data?.data.totalBorrowers)}
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
  
            <GrowthIndicator
               value={borrowerGrowth}
            />

          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Active Loans
                </p>
  
                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                    {formatNumber(data?.data.totalActiveLoans)}
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CreditCard
                  className="text-emerald-600"
                  size={28}
                />
              </div>
            </div>
  
           
            <GrowthIndicator
               value={activeLoanGrowth}
            />
          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  CIC Exports
                </p>
  
                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                  {formatNumber(data?.data.totalExports)}
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <FileSpreadsheet
                  className="text-orange-600"
                  size={28}
                />
              </div>
            </div>
  
            <div className="mt-6 flex items-center gap-2 text-sm">
              <ArrowUpRight
                className="text-blue-500"
                size={16}
              />
  
              <span className="text-blue-600 font-medium">
                Monthly Export
              </span>
            </div>
          </div>
  
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Loan Amount
                </p>
  
                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                  {formatCompactCurrency(data?.data.totalLoanAmount)}
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <TrendingUp
                  className="text-purple-600"
                  size={28}
                />
              </div>
            </div>
  
            <GrowthIndicator
               value={loanAmountGrowth}
            />
          </div>
        </div>
  
   {/* CHART SECTION */}
<div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm">

<div className="flex items-center justify-between mb-6">

   <div>

      <h2 className="text-xl font-semibold text-slate-800">
         Loan Analytics
      </h2>

      <p className="text-sm text-slate-500 mt-1">
         Monthly borrower and loan overview
      </p>

   </div>

   <button className="
      px-4
      py-2
      rounded-xl
      bg-slate-100
      hover:bg-slate-200
      transition
      text-sm
      font-medium
   ">
      View Report
   </button>

</div>

<LoanAnalyticsChart
   data={
      data?.data.monthlyLoanTrends ?? []
   }
/>

</div>
  
        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Recent CIC Exports
              </h2>
  
              <p className="text-sm text-slate-500 mt-1">
                Latest generated reports
              </p>
            </div>
  
            <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium">
              Generate Export
            </button>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>
  
                  <th className="text-left py-4 text-sm font-semibold text-slate-600">
                    Branch
                  </th>
  
                  <th className="text-left py-4 text-sm font-semibold text-slate-600">
                    Records
                  </th>
  
                  <th className="text-left py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
  
                  <th className="text-left py-4 text-sm font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
  
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-4 text-sm text-slate-700">
                    Aug 11, 2025
                  </td>
  
                  <td className="py-4 text-sm text-slate-700">
                    Main Branch
                  </td>
  
                  <td className="py-4 text-sm text-slate-700">
                    1,200
                  </td>
  
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Success
                    </span>
                  </td>
  
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Download
                    </button>
                  </td>
                </tr>
  
                <tr className="border-b border-slate-100">
                  <td className="py-4 text-sm text-slate-700">
                    Aug 10, 2025
                  </td>
  
                  <td className="py-4 text-sm text-slate-700">
                    Main Branch
                  </td>
  
                  <td className="py-4 text-sm text-slate-700">
                    980
                  </td>
  
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                      Pending
                    </span>
                  </td>
  
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }