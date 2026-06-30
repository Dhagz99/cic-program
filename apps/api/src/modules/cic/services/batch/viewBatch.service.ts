import prisma from "../../../../lib/prisma"

export const getBatchByIdService = async (
    batchId: string
) => {

    const batch = await prisma.importBatch.findUnique({
        where:{
            id: batchId
        },
        include:{
            branch: true,
            reportingPeriod: true,
            uploadedBy:{
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true
                },
            },
        },
    });

    if(!batch) {
        throw new Error("BATCH_NOT_FOUND");
    }

    return batch;

}