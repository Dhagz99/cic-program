import iconv from "iconv-lite";

export const decodeDbfText = (
   value: any
) => {

   if (!value) {

      return "";

   }

   try {

      const buffer =
         Buffer.from(
            String(value),
            "binary"
         );

      /*
      -----------------------------------
      TRY CP437 FIRST
      -----------------------------------
      */

      let decoded =
         iconv.decode(
            buffer,
            "cp437"
         );

      /*
      -----------------------------------
      CLEAN REPLACEMENT CHARACTERS
      -----------------------------------
      */

      decoded =
         decoded
         .replace(/¥/g, "Ñ")
         .replace(/�/g, "Ñ");

      return decoded.trim();

   } catch {

      return String(value).trim();

   }

};