export const normalizeAddress = (
   address?: string | null
): string => {

   if (!address) {

      return "";

   }

   return address

      .toUpperCase()

      /*
      --------------------------------
      REMOVE SPECIAL CHARACTERS
      --------------------------------
      */

      .replace(/[.,;:/\\\-]/g, " ")

      /*
      --------------------------------
      STANDARDIZE BARANGAY TERMS
      --------------------------------
      */

      .replace(/\bBRGY\b/g, "BARANGAY")

      .replace(/\bBGY\b/g, "BARANGAY")

      .replace(/\bBRG\b/g, "BARANGAY")

      /*
      --------------------------------
      STANDARDIZE POBLACION
      --------------------------------
      */

      .replace(/\bPOBLACION\b/g, "POB")

      .replace(/\bPORLACION\b/g, "POB")

      .replace(/\bPBLACION\b/g, "POB")

      .replace(/\bPOBL\b/g, "POB")

      /*
      --------------------------------
      STANDARDIZE COMMON TERMS
      --------------------------------
      */

      .replace(/\bSIQ\b/g, "SIQUIJOR")

      .replace(/\bNEG OR\b/g, "NEGROS ORIENTAL")

      .replace(/\bNEG OCC\b/g, "NEGROS OCCIDENTAL")

      .replace(/\bSCC\b/g, "SAN CARLOS CITY")

      /*
      --------------------------------
      FIX BROKEN DBF WORDS
      --------------------------------
      */

      .replace(/SIQUIJ\s+OR/g, "SIQUIJOR")

      .replace(/SIQ\s+UIJOR/g, "SIQUIJOR")

      .replace(/SIQU\s+IJOR/g, "SIQUIJOR")

      .replace(/SI\s+QUIJOR/g, "SIQUIJOR")

      .replace(/VILLANUEV\s+A/g, "VILLANUEVA")

      .replace(/GUIHULNGAN C ITY/g, "GUIHULNGAN CITY")

      .replace(/CANLAO N/g, "CANLAON")

      .replace(/SAN C ARLOS/g, "SAN CARLOS")

      .replace(/VALLEHERMSO/g, "VALLEHERMOSO")

      .replace(/LALIBERTAD/g, "LA LIBERTAD")

      /*
      --------------------------------
      REMOVE EXTRA SPACES
      --------------------------------
      */

      .replace(/\s+/g, " ")

      .trim();

};