import { Prisma } from "@prisma/client";
import prisma from "../../../../lib/prisma";

export class BatchNotFoundError extends Error {
   constructor() {
      super("Batch not found");
      this.name = "BatchNotFoundError";
   }
}

export class BatchDeleteRestrictedError extends Error {
   constructor() {
      super(
         "Batch cannot be deleted because related contracts or clients still exist."
      );
      this.name = "BatchDeleteRestrictedError";
   }
}

export const deleteBatchService = async (id: string) => {
   try {
      return await prisma.importBatch.delete({
         where: { id },
      });
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         // Record does not exist
         if (error.code === "P2025") {
            throw new BatchNotFoundError();
         }

         // Foreign-key restriction
         if (error.code === "P2003") {
            throw new BatchDeleteRestrictedError();
         }
      }

      throw error;
   }
};