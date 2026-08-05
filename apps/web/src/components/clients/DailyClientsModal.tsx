"use client";

import * as React from "react";
import { Pencil, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StagingClient, UpdateClientFormValues } from "@repo/shared";
import EditClientModal from "./EditClientModal";
import { useCivilStatusDomain, useGenderDomain, useIdentificationTypeDomain } from "@/hooks/cic/useDomain";
import {useUpdateDailyClient } from "@/hooks/clients/useClients";
import { useDomains } from "@/hooks/useGeneral";
import { toast } from "sonner";

export type DailyClient = {
  id: string;
  recordType: string;

  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  suffix?: string | null;

  accountNumber?: string | null;
  providerCode?: string | null;

  genderCode?: string | null;
  birthDate?: string | null;

  status?: string | null;
};

export type ClientBatch = {
  id: string;
  branchId: string;
  fileName: string;
  status: string;
  totalRecords: number;
  createdAt: string;
  updatedAt: string;
  dailyClients: StagingClient[];
};

interface DailyClientsModalProps {
  isOpen: boolean;
  batch: ClientBatch | null;
  onClose: () => void;
}

export function DailyClientsModal({
  isOpen,
  batch,
  onClose,
}: DailyClientsModalProps) {
  
  const clients = batch?.dailyClients ?? [];



  
      const {
          data: genders
      } = useGenderDomain();
    
      const {
          data: civilStatuses
      } = useCivilStatusDomain();
    
      const {
          data: identificationTypes
      } = useIdentificationTypeDomain();

      const { data: contact_type } = useDomains("CONTACT_TYPE");



            const toEditFormValues = (
               client: StagingClient & {
                 secondaryIdentificationTypeCode?: number | string | null;
                 identificationTypeCode?: number | string | null;
                 genderCode?: number | string | null;
                 civilStatusCode?: number | string | null;
               }
             ): UpdateClientFormValues => {
               const secondaryCode =
                 client.secondaryIdentificationType?.code ??
                 client.secondaryIdentificationTypeCode ??
                 "";
             
               const values: UpdateClientFormValues = {
                 firstName: client.firstName ?? "",
                 middleName: client.middleName ?? "",
                 lastName: client.lastName ?? "",
                 suffix: client.suffix ?? "",
             
                gender:
                     String(client.genderCode ?? client.gender?.code ?? ""),
             
                 birthDate: client.birthDate
                   ? String(client.birthDate).slice(0, 10)
                   : "",
             
                 placeOfBirth: client.placeOfBirth ?? "",
             
                 civilStatus:
                   String(client.civilStatusCode ??  client.civilStatus?.code ?? "" ),
             
                 numberOfDependents: Number(
                   client.numberOfDependents ?? 0
                 ),
             
                 addressType: client.addressType ?? "MI",
                 address: client.address ?? "",
             
                 addressType2: client.addressType2 ?? "AI",
                 address2: client.address2 ?? "",
             
                 identificationType: String(client.identificationTypeCode) ?? String(
                   client.identificationType?.code ?? ""
                 ),
             
                 identificationNumber:
                   client.identificationNumber ?? "",
             
                 secondaryIdentificationType:
                   String(secondaryCode),
             
                 secondaryIdentificationNumber:
                   client.secondaryIdentificationNumber ?? "",
             
                 contactType: String(
                   client.contactType ?? ""
                 ),
             
                 contactValue:
                   client.contactValue ?? ""
               };
             
            
             
               return values;
             };
      
  

        const [editClient, setEditClient] =
        React.useState<StagingClient | null>(null);
      
      const editClientFormValues = React.useMemo(() => {
        if (!editClient) {
          return null;
        }

        return toEditFormValues(editClient);
      }, [editClient]);
      


      const updateClientMutation = useUpdateDailyClient();
        const handleUpdateClient = async (
            values: UpdateClientFormValues
        ) => {
            if (!editClient) {
              throw new Error(
                "No client was selected."
              );
            }
            try{
               await updateClientMutation.mutateAsync({
                    id: editClient.id,
                    data: values
               });
              toast.success("Client updated successfully.");
            }catch(error){
                toast.error(
                  error instanceof Error
                    ? error.message
                      : "Failed to update client"
                );
            }
        };

        if (!isOpen) {
          return null;
        }

     /*
        |--------------------------------------------------------------------------
        | DOMAINS
        |--------------------------------------------------------------------------
        */
    

  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-clients-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <h2
              id="daily-clients-title"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Users className="size-5" />
              Daily Clients
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review and update client records from{" "}
              <span className="font-medium text-foreground">
                {batch?.fileName ?? "selected batch"}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b bg-muted/30 px-6 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">File:</span>{" "}
              <span className="font-medium">
                {batch?.fileName ?? "-"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span className="font-medium">
                {batch?.status ?? "-"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Records:</span>{" "}
              <span className="font-medium">
                {clients.length}
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {clients.length === 0 ? (
            <div className="flex min-h-52 items-center justify-center text-sm text-muted-foreground">
              No daily clients found.
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 z-10 bg-background shadow-sm">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Account Number
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Birth Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client, index) => {
                  const fullName = [
                    client.firstName,
                    client.middleName,
                    client.lastName,
                    client.suffix,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr
                      key={client.id}
                      className="border-b transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {fullName || "Unnamed client"}
                      </td>

                      <td className="px-4 py-3">
                        {client.providerSubjectNo ?? "-"}
                      </td>

                      <td className="px-4 py-3">
                        {client.address ?? ""}
                      </td>

                      <td className="px-4 py-3">
                        {client.birthDate ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {client.isConfirmed ? "True" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditClient(client)}
                        >
                          <Pencil data-icon="inline-start" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      {editClient && (
  <EditClientModal
    isOpen={true}
    client={editClientFormValues}
    genders={genders ?? []}
    civilStatuses={civilStatuses ?? []}
    identificationTypes={ identificationTypes ?? [] }
    contactTypes= { contact_type ?? [] }
    onClose={() => setEditClient(null)}
    onSubmit={handleUpdateClient}
  />
)}
    </div>
  );
}