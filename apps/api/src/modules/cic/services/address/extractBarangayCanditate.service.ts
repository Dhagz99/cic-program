export const extractBarangayCandidate = (
    normalizedAddress: string
 ): string | null => {
 
    /*
    --------------------------------
    BARANGAY KEYWORDS
    --------------------------------
    */
 
    const patterns = [
 
       /BARANGAY\s+([A-Z0-9\s\-]+)/,
 
       /BRGY\s+([A-Z0-9\s\-]+)/,
 
       /BGY\s+([A-Z0-9\s\-]+)/,
 
       /B\s+([A-Z0-9\s\-]+)/,
 
    ];
 
    for (const pattern of patterns) {
 
       const match =
          normalizedAddress.match(
             pattern
          );
 
       if (!match?.[1]) {
 
          continue;
 
       }
 
       /*
       --------------------------------
       EXTRACT POSSIBLE BARANGAY
       --------------------------------
       */
 
       const candidate =
          match[1]
 
             .split(" ")
 
             .slice(0, 3)
 
             .join(" ")
 
             .trim();
 
       if (candidate.length > 1) {
 
          return candidate;
 
       }
 
    }
 
    return null;
 
 };