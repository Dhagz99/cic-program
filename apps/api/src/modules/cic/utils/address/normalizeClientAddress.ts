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
      STANDARDIZE SIQUIJOR
      --------------------------------
      */

      .replace(/\bSIQ\b/g, "SIQUIJOR")

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

      /*
      --------------------------------
      REMOVE DUPLICATE WORDS
      Example:
      SIQUIJOR SIQUIJOR
      --------------------------------
      */

      .split(" ")

      .filter((word, index, array) => {

         return array.indexOf(word) === index;

      })

      .join(" ")

      /*
      --------------------------------
      REMOVE EXTRA SPACES
      --------------------------------
      */

      .replace(/\s+/g, " ")

      .trim();

};