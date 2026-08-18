import prisma from "../../../src/lib/prisma";

const additionalZipCodes = [
  {
    regionName: "NCR (National Capital Region)",
    provinceName: "Metro Manila",
    municipalityName: "Muntinlupa",

    zipCode: "1772",

    normalizedProvince: "METRO MANILA",
    normalizedMunicipality: "MUNTINLUPA",

    source: "MANUAL",
    verifiedAt: new Date()
  }
];

async function main() {
  for (const item of additionalZipCodes) {
    await prisma.postalCodeReference.upsert({
      where: {
        normalizedProvince_normalizedMunicipality_zipCode: {
          normalizedProvince:
            item.normalizedProvince,
          normalizedMunicipality:
            item.normalizedMunicipality,
          zipCode:
            item.zipCode
        }
      },

      update: {},

      create: item
    });
  }

  console.log(
    `Seeded ${additionalZipCodes.length} additional ZIP codes.`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });