import { DBFFile } from "dbffile";

export const parseDbfFile = async (
   filePath: string
) => {

   const dbf =
      await DBFFile.open(filePath);

   const records =
      await dbf.readRecords();

   return records;
};