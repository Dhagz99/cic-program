import { decodeDbfText } from "../../utils/decodeDbfText";

export const getRawAddressFromDbfRow = (
   row: any
) => {
   const decodedAdd1 =
      decodeDbfText(row.ADD1);

   const decodedAdd2 =
      decodeDbfText(row.ADD2);

   return [
      decodedAdd1?.trim(),
      decodedAdd2?.trim()
   ]
      .filter(Boolean)
      .join(", ");
};