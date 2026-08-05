import prisma from "../../lib/prisma";

export function normalizeLocationName(
  value: string
): string {
  return value
    .toUpperCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bCITY OF\b/g, "")
    .replace(/\bMUNICIPALITY OF\b/g, "")
    .replace(/\bPROVINCE OF\b/g, "")
    .replace(/[().,'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractPostalCode(
  address: string
): string | null {
  const match = address.match(
    /(?:^|[,\s])(\d{4})(?:$|[,\s])/
  );

  return match?.[1] ?? null;
}

function getAddressParts(
  address: string
): string[] {
  return address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const normalized =
        part.toUpperCase();

      return (
        normalized !== "PH" &&
        normalized !== "PHILIPPINES" &&
        !/^\d{4}$/.test(part)
      );
    });
}

export async function resolvePostalCodeFromAddress(
  address: string
) {
  const parts =
    getAddressParts(address);

  for (
    let index = parts.length - 1;
    index >= 0;
    index--
  ) {
    const normalizedMunicipality =
      normalizeLocationName(
        parts[index]
      );

    const possibleProvince =
      index + 1 < parts.length
        ? normalizeLocationName(
            parts[index + 1]
          )
        : null;

    if (possibleProvince) {
      const exactMatch =
        await prisma.postalCodeReference.findFirst({
          where: {
            normalizedMunicipality,
            normalizedProvince:
              possibleProvince
          },

          select: {
            zipCode: true,
            provinceName: true,
            municipalityName: true
          }
        });

      if (exactMatch) {
        return exactMatch;
      }
    }
  }

  for (
    let index = parts.length - 1;
    index >= 0;
    index--
  ) {
    const normalizedMunicipality =
      normalizeLocationName(
        parts[index]
      );

    const matches =
      await prisma.postalCodeReference.findMany({
        where: {
          normalizedMunicipality
        },

        take: 2,

        select: {
          zipCode: true,
          provinceName: true,
          municipalityName: true
        }
      });

    if (matches.length === 1) {
      return matches[0];
    }
  }

  return null;
}