import { DbfTypes } from "@repo/shared";
import { DBFFile } from "dbffile";

export const parseDbfFile = async (
   filePath: string
): Promise<DbfTypes[]> => {

   const dbf =
      await DBFFile.open(filePath);

   const records =
      await dbf.readRecords();

   return records as unknown as DbfTypes[];
};