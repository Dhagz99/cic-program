import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import prisma from "../src/lib/prisma";

type PostalCodeCsvRow = {
  regionName: string;
  provinceName: string;
  municipalityName: string;
  zipCode: string;
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
    "postal_codes_phlpost.csv"
  );

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `CSV file not found: ${csvPath}`
    );
  }

  const content =
    fs.readFileSync(csvPath, "utf8");

  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as PostalCodeCsvRow[];

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!/^\d{4}$/.test(row.zipCode)) {
      skipped++;
      continue;
    }

    const normalizedProvince =
      normalizeLocationName(
        row.provinceName
      );

    const normalizedMunicipality =
      normalizeLocationName(
        row.municipalityName
      );

    await prisma.postalCodeReference.upsert({
      where: {
        normalizedProvince_normalizedMunicipality_zipCode:
          {
            normalizedProvince,
            normalizedMunicipality,
            zipCode: row.zipCode,
          },
      },

      update: {
        regionName: row.regionName,
        provinceName: row.provinceName,
        municipalityName:
          row.municipalityName,
        sourceUrl:
          "https://phlpost.gov.ph/zip-code-locator/",
        importedAt: new Date(),
      },

      create: {
        regionName: row.regionName,
        provinceName: row.provinceName,
        municipalityName:
          row.municipalityName,
        zipCode: row.zipCode,

        normalizedProvince,
        normalizedMunicipality,

        source: "PHLPOST",
        sourceUrl:
          "https://phlpost.gov.ph/zip-code-locator/",
      },
    });

    imported++;
  }

  console.log({
    totalRows: rows.length,
    imported,
    skipped,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });