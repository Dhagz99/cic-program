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

export type PSGCReferenceCache = {
   list: PSGCReferenceCacheItem[];

   barangayNames: string[];
   municipalityNames: string[];
   provinceNames: string[];

   byBarangayMunicipality: Map<string, PSGCReferenceCacheItem>;
   byMunicipalityProvince: Map<string, PSGCReferenceCacheItem>;
   byProvince: Map<string, PSGCReferenceCacheItem>;
};

let psgcMemoryCache: PSGCReferenceCache | null = null;

export const loadPSGCReferenceCache =
   async (): Promise<PSGCReferenceCache> => {
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

      const list =
         references.map((item) => ({
            ...item,

            searchableProvinceName:
               normalizeText(item.provinceName),

            searchableMunicipalityName:
               normalizeText(item.municipalityName),

            searchableBarangayName:
               normalizeText(item.barangayName)
         }));

      const barangayNames =
         [
            ...new Set(
               list
                  .map((item) => item.searchableBarangayName)
                  .filter(Boolean)
            )
         ].sort((a, b) => b.length - a.length);

      const municipalityNames =
         [
            ...new Set(
               list
                  .map((item) => item.searchableMunicipalityName)
                  .filter(Boolean)
            )
         ].sort((a, b) => b.length - a.length);

      const provinceNames =
         [
            ...new Set(
               list
                  .map((item) => item.searchableProvinceName)
                  .filter(Boolean)
            )
         ].sort((a, b) => b.length - a.length);

      const byBarangayMunicipality =
         new Map<string, PSGCReferenceCacheItem>();

      const byMunicipalityProvince =
         new Map<string, PSGCReferenceCacheItem>();

      const byProvince =
         new Map<string, PSGCReferenceCacheItem>();

      for (const item of list) {
         if (
            item.searchableBarangayName &&
            item.searchableMunicipalityName
         ) {
            byBarangayMunicipality.set(
               `${item.searchableBarangayName}|${item.searchableMunicipalityName}`,
               item
            );
         }

         if (
            item.searchableMunicipalityName &&
            item.searchableProvinceName
         ) {
            byMunicipalityProvince.set(
               `${item.searchableMunicipalityName}|${item.searchableProvinceName}`,
               item
            );
         }

         if (item.searchableProvinceName) {
            byProvince.set(
               item.searchableProvinceName,
               item
            );
         }
      }

      psgcMemoryCache = {
         list,
         barangayNames,
         municipalityNames,
         provinceNames,
         byBarangayMunicipality,
         byMunicipalityProvince,
         byProvince
      };

      return psgcMemoryCache;
   };

export const clearPSGCReferenceCache = () => {
   psgcMemoryCache = null;
};