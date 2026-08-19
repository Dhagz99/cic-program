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
    .replace(/\bBARANGAY\b/g, "")
    .replace(/\bBRGY\.?\b/g, "")
    .replace(/\bBGY\.?\b/g, "")
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
  const parts = getAddressParts(address);

  const normalizedParts =
    parts.map(normalizeLocationName);

  /*
   * PRIORITY 1:
   * Municipality + Province
   *
   * Example:
   *
   * MAHABANG PARANG,
   * ANGONO,
   * RIZAL
   *
   * municipality = ANGONO
   * province     = RIZAL
   */
  for (
    let municipalityIndex =
      normalizedParts.length - 2;
    municipalityIndex >= 0;
    municipalityIndex--
  ) {
    const normalizedMunicipality =
      normalizedParts[municipalityIndex];

    const normalizedProvince =
      normalizedParts[
        municipalityIndex + 1
      ];

    const candidates =
      await prisma.postalCodeReference.findMany({
        where: {
          normalizedMunicipality,
          normalizedProvince,
        },

        select: {
          zipCode: true,
          provinceName: true,
          municipalityName: true,

          postalAreaName: true,
          postalAreaType: true,

          normalizedProvince: true,
          normalizedMunicipality: true,
          normalizedPostalArea: true,
        },
      });

    if (candidates.length === 0) {
      continue;
    }

    /*
     * PRIORITY 1A:
     * Postal area + municipality + province
     *
     * Search address segments before municipality.
     */
    for (
      let areaIndex =
        municipalityIndex - 1;
      areaIndex >= 0;
      areaIndex--
    ) {
      const normalizedArea =
        normalizedParts[areaIndex];

      const areaMatch =
        candidates.find(
          (record) =>
            record.normalizedPostalArea ===
            normalizedArea
        );

      if (areaMatch) {
        return {
          ...areaMatch,
          matchLevel:
            "POSTAL_AREA" as const,
        };
      }
    }

    /*
     * PRIORITY 1B:
     * Municipality-level record
     */
    const municipalityLevelRecords =
      candidates.filter(
        (record) =>
          !record.normalizedPostalArea
      );

    const municipalityZipCodes =
      new Set(
        municipalityLevelRecords.map(
          (record) => record.zipCode
        )
      );

    if (
      municipalityLevelRecords.length > 0 &&
      municipalityZipCodes.size === 1
    ) {
      return {
        ...municipalityLevelRecords[0],
        matchLevel:
          "MUNICIPALITY" as const,
      };
    }

    /*
     * There may only be postal-area records.
     *
     * If every postal area uses the same ZIP,
     * resolving at municipality level is safe.
     */
    const allZipCodes =
      new Set(
        candidates.map(
          (record) => record.zipCode
        )
      );

    if (allZipCodes.size === 1) {
      return {
        ...candidates[0],
        matchLevel:
          "MUNICIPALITY" as const,
      };
    }

    /*
     * Don't return null here.
     *
     * Another municipality/province pair
     * may still match.
     */
  }

  /*
   * PRIORITY 2:
   * Municipality only
   *
   * Useful when province isn't included:
   *
   * POBLACION, DANAO CITY, PH
   */
  for (
    let municipalityIndex =
      normalizedParts.length - 1;
    municipalityIndex >= 0;
    municipalityIndex--
  ) {
    const normalizedMunicipality =
      normalizedParts[
        municipalityIndex
      ];

    const candidates =
      await prisma.postalCodeReference.findMany({
        where: {
          normalizedMunicipality,
        },

        select: {
          zipCode: true,
          provinceName: true,
          municipalityName: true,

          postalAreaName: true,
          postalAreaType: true,

          normalizedProvince: true,
          normalizedMunicipality: true,
          normalizedPostalArea: true,
        },
      });

    if (candidates.length === 0) {
      continue;
    }

    /*
     * Try postal area first.
     */
    for (
      let areaIndex =
        municipalityIndex - 1;
      areaIndex >= 0;
      areaIndex--
    ) {
      const normalizedArea =
        normalizedParts[areaIndex];

      const areaMatch =
        candidates.find(
          (record) =>
            record.normalizedPostalArea ===
            normalizedArea
        );

      if (areaMatch) {
        return {
          ...areaMatch,
          matchLevel:
            "POSTAL_AREA" as const,
        };
      }
    }

    /*
     * Municipality-only resolution is allowed
     * only when there is one unique ZIP.
     */
    const uniqueZipCodes =
      new Set(
        candidates.map(
          (record) => record.zipCode
        )
      );

    if (uniqueZipCodes.size === 1) {
      return {
        ...candidates[0],
        matchLevel:
          "MUNICIPALITY" as const,
      };
    }

    /*
     * Ambiguous municipality.
     *
     * Don't guess and don't immediately return.
     * Continue checking the other address parts.
     */
  }

  return null;
}