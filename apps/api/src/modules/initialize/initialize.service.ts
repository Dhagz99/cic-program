import { InitializeParams } from "@repo/shared";
import { Prisma } from "../../../generated/prisma";
import prisma from "../../lib/prisma";

export async function getLastImportBatchService(
  branchId?: string
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




export async function getInitializeService({
  branchId,
  isAdmin,
  page = 1,
  limit = 10,
  search = "",
}: InitializeParams) {
  const skip = (page - 1) * limit;

  const branchFilter: Prisma.ImportBatchWhereInput = isAdmin
    ? {}
    : {
        branchId,
      };

  const whereCondition: Prisma.ImportBatchWhereInput = {
    ...branchFilter,

    ...(search
      ? {
          OR: [
            {
              fileName: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [initialize, total] = await Promise.all([
    prisma.importBatch.findMany({
      where: whereCondition,
      include:{
        branch: true,
        reportingPeriod: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.importBatch.count({
      where: whereCondition,
    }),
  ]);

  return {
    data: initialize,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}