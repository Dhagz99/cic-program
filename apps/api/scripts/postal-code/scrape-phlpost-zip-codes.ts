import axios from "axios";
import * as cheerio from "cheerio";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";

type PostalCodeRow = {
  regionName: string;
  provinceName: string;
  municipalityName: string;
  zipCode: string;
};

const SOURCE_URL =
  "https://phlpost.gov.ph/zip-code-locator/";

function cleanText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidZipCode(value: string): boolean {
  return /^\d{4}$/.test(value);
}

async function scrapePostalCodes(): Promise<PostalCodeRow[]> {
  const response = await axios.get<string>(SOURCE_URL, {
    timeout: 30_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 AddressReferenceImporter/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const $ = cheerio.load(response.data);
  const records: PostalCodeRow[] = [];

  $("table tbody tr").each((_index, element) => {
    const cells = $(element)
      .find("td")
      .map((_cellIndex, cell) =>
        cleanText($(cell).text())
      )
      .get();

    if (cells.length < 4) {
      return;
    }

    const [
      regionName,
      provinceName,
      municipalityName,
      zipCode,
    ] = cells;

    const isCompletelyEmpty =
  cells.every((cell) => !cell);

if (isCompletelyEmpty) {
  return;
}

    if (
  !regionName ||
  !provinceName ||
  !municipalityName ||
  !isValidZipCode(zipCode)
) {
  console.warn("Skipped invalid row:", cells);
  return;
}

    records.push({
      regionName,
      provinceName,
      municipalityName,
      zipCode,
    });
  });

  return records;
}

function removeDuplicates(
  records: PostalCodeRow[]
): PostalCodeRow[] {
  const uniqueRecords = new Map<
    string,
    PostalCodeRow
  >();

  for (const record of records) {
    const key = [
      record.regionName.toUpperCase(),
      record.provinceName.toUpperCase(),
      record.municipalityName.toUpperCase(),
      record.zipCode,
    ].join("|");

    uniqueRecords.set(key, record);
  }

  return [...uniqueRecords.values()];
}

async function saveToCsv(
  records: PostalCodeRow[]
): Promise<string> {
  const outputPath = path.resolve(
    process.cwd(),
    "postal_codes_phlpost.csv"
  );

  const writer = createObjectCsvWriter({
    path: outputPath,
    header: [
      {
        id: "regionName",
        title: "regionName",
      },
      {
        id: "provinceName",
        title: "provinceName",
      },
      {
        id: "municipalityName",
        title: "municipalityName",
      },
      {
        id: "zipCode",
        title: "zipCode",
      },
    ],
  });

  await writer.writeRecords(records);

  return outputPath;
}

async function main(): Promise<void> {
  console.log("Downloading PHLPost ZIP-code data...");

  const scrapedRecords =
    await scrapePostalCodes();

  if (scrapedRecords.length === 0) {
    throw new Error(
      "No postal-code rows were found. The page structure may have changed."
    );
  }

  const records =
    removeDuplicates(scrapedRecords);

  const outputPath =
    await saveToCsv(records);

  console.log(
    `Scraped rows: ${scrapedRecords.length}`
  );

  console.log(
    `Unique valid rows: ${records.length}`
  );

  console.log(
    `CSV saved to: ${outputPath}`
  );
}

main().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(
      "PHLPost request failed:",
      error.response?.status,
      error.message
    );
  } else {
    console.error(error);
  }

  process.exit(1);
});