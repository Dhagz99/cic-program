import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

import prisma from "../../src/lib/prisma";

type PostalCodeCsvRow = {
  regionName: string;
  provinceName: string;
  municipalityName: string;
  zipCode: string;

  normalizedProvince?: string;
  normalizedMunicipality?: string;
  source?: string;
};

function normalizeLocationName(
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

async function main(): Promise<void> {
  const csvPath = path.resolve(
    process.cwd(),
    "scripts",
    "postal-code",
    "csv",
    "postal_codes_phlpost.csv"
  );

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `CSV file not found: ${csvPath}`
    );
  }

  const content = fs.readFileSync(
    csvPath,
    "utf8"
  );

  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  }) as PostalCodeCsvRow[];

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      if (
        !row.regionName ||
        !row.provinceName ||
        !row.municipalityName ||
        !/^\d{4}$/.test(row.zipCode)
      ) {
        skipped++;

        console.warn(
          "Skipped invalid row:",
          row
        );

        continue;
      }

      const normalizedProvince =
        row.normalizedProvince?.trim() ||
        normalizeLocationName(
          row.provinceName
        );

      const normalizedMunicipality =
        row.normalizedMunicipality?.trim() ||
        normalizeLocationName(
          row.municipalityName
        );

      await prisma.postalCodeReference.upsert({
        where: {
          normalizedProvince_normalizedMunicipality_zipCode:
            {
              normalizedProvince,
              normalizedMunicipality,
              zipCode: row.zipCode
            }
        },

        update: {
          regionName:
            row.regionName.trim(),

          provinceName:
            row.provinceName.trim(),

          municipalityName:
            row.municipalityName.trim(),

          source:
            row.source?.trim() ||
            "VISAYAS_CSV",

          sourceUrl: null,

          importedAt:
            new Date()
        },

        create: {
          regionName:
            row.regionName.trim(),

          provinceName:
            row.provinceName.trim(),

          municipalityName:
            row.municipalityName.trim(),

          zipCode:
            row.zipCode.trim(),

          normalizedProvince,

          normalizedMunicipality,

          source:
            row.source?.trim() ||
            "VISAYAS_CSV",

          sourceUrl: null
        }
      });

      imported++;
    } catch (error) {
      failed++;

      console.error(
        "Failed row:",
        row,
        error
      );
    }
  }

  console.log({
    totalRows: rows.length,
    imported,
    skipped,
    failed
  });
}

main()
  .catch((error: unknown) => {
    console.error(
      "Postal code import failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });