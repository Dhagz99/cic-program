import DBFFile from "dbffile";
import prisma from "../../../lib/prisma";
import { parseFullName } from "./dbf.helper";



export async function importDbfService(
    filePath: string
  ) {
    const dbf = await DBFFile.open(filePath);
  
    const records = await dbf.readRecords();

    console.log(records)
  
    let count = 0;
  
    for (const row of records as any[]) {
      const parsedName = parseFullName(row.NAME);
      await prisma.cicData.create({
        data: {
          accountId: row.ID,
          firstName: parsedName.firstName,
        lastName: parsedName.lastName,
          middleName: parsedName.middleName,
        },
      });
  
      count++;
    }
  
    return {
      count,
    };
  }