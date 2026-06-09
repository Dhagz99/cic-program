import prisma from "../../lib/prisma";

export async function getLastImportBatchService(
  branchId: string
) {
  return await prisma.importBatch.findFirst({
    where: {
      branchId,
      status: "PENDING_COMPLETION",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}