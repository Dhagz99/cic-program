import type {
  ClientPostalAuditItem,
  ClientPostalAuditResponse,
  UpdateClientPostalCodesDTO
} from "@repo/shared";

import prisma from "../../lib/prisma";

import {
  resolvePostalCodeFromAddress
} from "./postal-code.resolver";

function buildClientName(client: {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
}): string {
  return [
    client.lastName,
    client.firstName,
    client.middleName
  ]
    .filter(Boolean)
    .join(", ");
}

export async function auditBranchPostalCodesService(
  branchId: string
): Promise<ClientPostalAuditResponse> {
  const clients =
    await prisma.client.findMany({
      where: {
        branchId
      },

      select: {
        id: true,
        providerSubjectNo: true,
        firstName: true,
        middleName: true,
        lastName: true,
        address: true,
        addressPostalCode: true,
        branchId: true
      },

      orderBy: [
        {
          lastName: "asc"
        },
        {
          firstName: "asc"
        }
      ]
    });

  const data: ClientPostalAuditItem[] = [];

  for (const client of clients) {
    const address =
      client.address?.trim() ?? "";

    if (!address) {
      data.push({
        clientId: client.id,
        providerSubjectNo:
          client.providerSubjectNo,
        clientName:
          buildClientName(client),
        address: null,
        currentPostalCode:
          client.addressPostalCode,
        detectedPostalCode: null,
        matchedProvince: null,
        matchedMunicipality: null,
        status: "UNRESOLVED",
        message:
          "Client has no address."
      });

      continue;
    }

    const resolved =
      await resolvePostalCodeFromAddress(
        address
      );

    if (!resolved) {
      data.push({
        clientId: client.id,
        providerSubjectNo:
          client.providerSubjectNo,
        clientName:
          buildClientName(client),
        address,
        currentPostalCode:
          client.addressPostalCode,
        detectedPostalCode: null,
        matchedProvince: null,
        matchedMunicipality: null,
        status: "UNRESOLVED",
        message:
          "No unique postal-code match was found."
      });

      continue;
    }

    const currentPostalCode =
      client.addressPostalCode?.trim() ||
      null;

    let status:
      | "CORRECT"
      | "MISSING"
      | "MISMATCH";

    let message: string;

    if (!currentPostalCode) {
      status = "MISSING";
      message =
        "Postal code is missing.";
    } else if (
      currentPostalCode !==
      resolved.zipCode
    ) {
      status = "MISMATCH";
      message =
        `Current postal code ${currentPostalCode} should be ${resolved.zipCode}.`;
    } else {
      status = "CORRECT";
      message =
        "Postal code is correct.";
    }

    data.push({
      clientId: client.id,
      providerSubjectNo:
        client.providerSubjectNo,
      clientName:
        buildClientName(client),
      address,
      currentPostalCode,
      detectedPostalCode:
        resolved.zipCode,
      matchedProvince:
        resolved.provinceName,
      matchedMunicipality:
        resolved.municipalityName,
      status,
      message
    });
  }

  return {
    branchId,

    summary: {
      total: data.length,

      correct:
        data.filter(
          (item) =>
            item.status === "CORRECT"
        ).length,

      missing:
        data.filter(
          (item) =>
            item.status === "MISSING"
        ).length,

      mismatch:
        data.filter(
          (item) =>
            item.status === "MISMATCH"
        ).length,

      unresolved:
        data.filter(
          (item) =>
            item.status === "UNRESOLVED"
        ).length
    },

    data
  };
}

export async function updateClientPostalCodesService(
  payload: UpdateClientPostalCodesDTO
) {
  return prisma.$transaction(async (tx) => {
    let updated = 0;

    for (const item of payload.items) {
      const client = await tx.client.findUnique({
        where: {
          id: item.clientId,
        },
        select: {
          address: true,
        },
      });

      const cleanedAddress = (client?.address ?? "")
        .replace(/,\s*\d{4}\s*$/i, "")
        .trim();

      await tx.client.update({
        where: {
          id: item.clientId,
        },
        data: {
          address: cleanedAddress
            ? `${cleanedAddress}, ${item.postalCode}`
            : null,
          addressPostalCode: item.postalCode,
        },
      });

      updated++;
    }

    return {
      updated,
    };
  });
}