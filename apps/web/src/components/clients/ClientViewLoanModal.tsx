import { ClientLoan } from "@repo/shared";
import {
   CalendarDays,
   CreditCard,
   FileText,
   Hash,
   Landmark,
   Wallet,
} from "lucide-react";

type Props = {
   loan: ClientLoan;
};

function formatDate(value?: string | null) {
   if (!value) return "-";

   return new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
   });
}

function formatMoney(value?: number | string | null) {
   if (value === null || value === undefined || value === "") return "-";

   return Number(value).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
   });
}

function Info({
   icon,
   label,
   value,
}: {
   icon: React.ReactNode;
   label: string;
   value?: React.ReactNode;
}) {
   return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
         <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase">
            {icon}
            {label}
         </div>

         <div className="mt-2 text-sm font-semibold text-slate-800">
            {value || "-"}
         </div>
      </div>
   );
}

export default function ClientViewLoanModal({ loan }: Props) {
   return (
      <div className="space-y-6">
      {/* CLIENT INFORMATION */}
<div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
   <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
      Client Information
   </h3>

   <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Info
         icon={<FileText size={16} />}
         label="Client Name"
         value={
            loan.client
               ? `${loan.client.lastName}, ${loan.client.firstName}`
               : "-"
         }
      />

      <Info
         icon={<Hash size={16} />}
         label="Subject No."
         value={loan.client?.providerSubjectNo}
      />

      <Info
         icon={<CreditCard size={16} />}
         label="Contact"
         value={loan.client?.contactValue}
      />

      <Info
         icon={<CalendarDays size={16} />}
         label="Birth Date"
         value={formatDate(loan.client?.birthDate)}
      />

      <Info
         icon={<FileText size={16} />}
         label="Gender"
         value={loan.client?.genderCode}
      />

      <Info
         icon={<Landmark size={16} />}
         label="Address"
         value={loan.client?.address}
      />
   </div>
</div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info
               icon={<Wallet size={16} />}
               label="Financed Amount"
               value={formatMoney(loan.financedAmount)}
            />

            <Info
               icon={<CreditCard size={16} />}
               label="Monthly Payment"
               value={formatMoney(loan.monthlyPaymentAmount)}
            />

            <Info
               icon={<Landmark size={16} />}
               label="Outstanding Balance"
               value={formatMoney(loan.outstandingBalance)}
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info
               icon={<CalendarDays size={16} />}
               label="Start Date"
               value={formatDate(loan.contractStartDate)}
            />

            <Info
               icon={<CalendarDays size={16} />}
               label="End Planned Date"
               value={formatDate(loan.contractEndPlannedDate)}
            />

            <Info
               icon={<CalendarDays size={16} />}
               label="First Payment Date"
               value={formatDate(loan.firstPaymentDate)}
            />

            <Info
               icon={<CalendarDays size={16} />}
               label="Next Payment Date"
               value={formatDate(loan.nextPaymentDate)}
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info
               icon={<Hash size={16} />}
               label="Installments"
               value={loan.installmentsNumber}
            />

            <Info
               icon={<Hash size={16} />}
               label="Outstanding Payments"
               value={loan.outstandingPaymentNumber}
            />

            <Info
               icon={<FileText size={16} />}
               label="Payment Method"
               value={loan.paymentMethod}
            />
         </div>
      </div>
   );
}