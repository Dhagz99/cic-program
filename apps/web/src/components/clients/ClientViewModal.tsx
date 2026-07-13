"use client";

import { useIdentificationTypeDomain } from "@/hooks/cic/useDomain";
import { useDomains } from "@/hooks/useGeneral";
import { DomainOption, StagingClient, StagingContract } from "@repo/shared";
import {
   BadgeCheck,
   BriefcaseBusiness,
   CalendarDays,
   ContactRound,
   CreditCard,
   CreditCardIcon,
   FileText,
   IdCard,
   Landmark,
   MapPin,
   Phone,
   User,
} from "lucide-react";

type Props = {
   client: StagingClient;
};

export default function ClientViewModal({ client }: Props) {

    const {data: contact_type} = useDomains("CONTACT_TYPE");

    console.log("client: ", client)
     

const contactTypeDescription =
      contact_type?.find(
            (item: DomainOption) =>
               item.code === client.contactType
         )?.description ?? client.contactType;

   const fullName = [
      client.firstName,
      client.middleName,
      client.lastName,
      client.suffix,
   ]
      .filter(Boolean)
      .join(" ");

   const contracts =
      client.Contracts ?? [];


   const totalFinanced = contracts.reduce(
      (sum, contract) =>
         sum + Number(contract.financedAmount ?? 0),
      0
   );

   const totalBalance = contracts.reduce(
      (sum, contract) =>
         sum + Number(contract.outstandingBalance ?? 0),
      0
   );

   return (
      <div className="space-y-6">

         <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
            <div className="flex items-start justify-between gap-4">
               <div>
                  <div className="flex items-center gap-3">
                     <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <User size={28} />
                     </div>

                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                           {fullName || "-"}
                        </h2>

                        <p className="text-sm text-slate-500">
                           Subject No: {client.providerSubjectNo ?? "-"}
                        </p>
                     </div>
                  </div>
               </div>

               <span className="rounded-full bg-blue-50 uppercase px-4 py-2 text-xs font-semibold text-blue-700">
                  {client.identificationType?.description ?? "CLIENT"}
               </span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MiniCard
               label="Contracts"
               value={contracts.length.toLocaleString()}
               icon={<FileText size={22} />}
            />

            <MiniCard
               label="Financed Amount"
               value={formatMoney(totalFinanced)}
               icon={<Landmark size={22} />}
            />

            <MiniCard
               label="Outstanding Balance"
               value={formatMoney(totalBalance)}
               icon={<CreditCard size={22} />}
            />
         </div>

         <Section title="Client Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <Info
                  icon={<BriefcaseBusiness size={18} />}
                  label="Branch"
                  value={client.branch?.branchName}
               />

               <Info
                  icon={<User size={18} />}
                  label="Gender"
                  value={client.gender?.description ?? ""}
               />

               <Info
                  icon={<BadgeCheck size={18} />}
                  label="Civil Status"
                  value={client.civilStatus?.description ??  ""}
               />

               <Info
                  icon={<CalendarDays size={18} />}
                  label="Birth Date"
                  value={formatDate(client.birthDate)}
               />

               <Info
                     icon={<IdCard size={18} />}
                     label="Identification Type."
                     value={client.identificationType?.description}
                  />

               <Info
                  icon={<CreditCardIcon size={18} />}
                  label="Identification No."
                  value={client.identificationNumber}
               />

               <Info
                     icon={<IdCard size={18} />}
                     label=" Secondary Identification Type."
                     value={client.secondaryIdentificationType?.description}
                  />

               <Info
                  icon={<CreditCardIcon size={18} />}
                  label="Secondary Identification No."
                  value={client?.secondaryIdentificationNumber}
               />  

                <Info
                  icon={<ContactRound size={18} />}
                  label="Contact Type"
                  value={contactTypeDescription}
               />
               
               <Info
                     icon={<Phone size={18} />}
                     label="Contact Value"
                     value={client.contactValue}
                  />     
              
               <div className="col-span-2">
                  <Info
                     icon={<MapPin size={18} />}
                     label="Address"
                     value={client.address}
                  />
               </div>
             

              
            </div>
         </Section>

         <Section title="Contracts">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200">
                        <Th>Contract No</Th>
                        <Th>Financed</Th>
                        <Th>Monthly</Th>
                        <Th>Installment</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Status</Th>
                        <Th>Last Payment Date</Th>
                        <Th>Last Payment</Th>
                        <Th>Outstanding Payment</Th>
                        <Th>Balance</Th>
                     </tr>
                  </thead>

                  <tbody>
                     {contracts.length === 0 ? (
                        <tr>
                           <td
                              colSpan={6}
                              className="py-10 text-center text-sm text-slate-500"
                           >
                              No contracts found
                           </td>
                        </tr>
                     ) : (
                        contracts.map((contract: StagingContract) => (
                           <tr
                              key={contract.id}
                              className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                           >
                              <Td strong>{contract.contractNo}</Td>
                              <Td>{formatMoney(contract.financedAmount)}</Td>
                              <Td>{formatMoney(contract.monthlyPaymentAmount)}</Td>
                              <Td>{contract.installmentsNumber}</Td>
                              <Td>{formatDate(contract.contractStartDate)}</Td>
                              <Td>{formatDate(contract.contractEndPlannedDate)}</Td>
                              <Td>
                                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {contract.contractPhase ?? "-"}
                                 </span>
                              </Td>
                              <Td>{formatDate(contract.lastPaymentDate)}</Td>
                              <Td>{formatMoney(contract.lastPaymentAmount)}</Td>
                              <Td>{contract.outstandingPaymentNumber}</Td>
                              <Td>{formatMoney(contract.outstandingBalance)}</Td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </Section>

      </div>
   );
}

function Section({
   title,
   children,
}: {
   title: string;
   children: React.ReactNode;
}) {
   return (
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
         <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-800">
               {title}
            </h3>
         </div>

         <div className="p-6">
            {children}
         </div>
      </div>
   );
}

function MiniCard({
   label,
   value,
   icon,
}: {
   label: string;
   value: string;
   icon: React.ReactNode;
}) {
   return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-sm text-slate-500">
                  {label}
               </p>

               <h4 className="mt-2 text-xl font-bold text-slate-900">
                  {value}
               </h4>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
               {icon}
            </div>
         </div>
      </div>
   );
}

function Info({
   icon,
   label,
   value,
}: {
   icon: React.ReactNode;
   label: string;
   value?: string | number | null;
}) {
   return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
         <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400">
               {icon}
            </div>

            <div>
               <p className="text-xs text-slate-500">
                  {label}
               </p>

               <p className="mt-1 text-sm font-semibold text-slate-800">
                  {value || "-"}
               </p>
            </div>
         </div>
      </div>
   );
}

function Th({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
         {children}
      </th>
   );
}

function Td({
   children,
   strong = false,
}: {
   children: React.ReactNode;
   strong?: boolean;
}) {
   return (
      <td
         className={`px-5 py-4 text-sm ${
            strong
               ? "font-semibold text-slate-900"
               : "text-slate-700"
         }`}
      >
         {children || "-"}
      </td>
   );
}

function formatDate(date?: string | Date | null) {
   if (!date) return "-";
   return new Date(date).toLocaleDateString();
}

function formatMoney(value?: string | number | null) {
   return `₱${Number(value ?? 0).toLocaleString()}`;
}