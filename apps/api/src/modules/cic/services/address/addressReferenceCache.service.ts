import prisma from "../../../../lib/prisma";

const normalizeText = (
   value?: string | null
) => {
   return String(value ?? "")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
};

export type PSGCReferenceCacheItem = {
   id: string;
   regionName: string | null;
   provinceName: string | null;
   municipalityName: string | null;
   barangayName: string | null;
   zipCode: string | null;

   searchableProvinceName: string;
   searchableMunicipalityName: string;
   searchableBarangayName: string;
};

let psgcMemoryCache: PSGCReferenceCacheItem[] | null = null;

export const loadPSGCReferenceCache = async () => {
   if (psgcMemoryCache) {
      return psgcMemoryCache;
   }

   const references =
      await prisma.pSGCReference.findMany({
         select: {
            id: true,
            regionName: true,
            provinceName: true,
            municipalityName: true,
            barangayName: true,
            zipCode: true
         }
      });

   psgcMemoryCache =
      references.map((item) => ({
         ...item,

         searchableProvinceName:
            normalizeText(item.provinceName),

         searchableMunicipalityName:
            normalizeText(item.municipalityName),

         searchableBarangayName:
            normalizeText(item.barangayName)
      }));

   return psgcMemoryCache;
};

export const clearPSGCReferenceCache = () => {
   psgcMemoryCache = null;
};