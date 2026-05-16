import prisma from "../../../../lib/prisma";

export const saveStagingContract = async ({
   batchId,
   stagingClientId,
   contract,
   validationErrors
}: any) => {

   const validationStatus =
      validationErrors.length > 0
      ? "WITH_ERRORS"
      : "COMPLETE";

   /*
   --------------------------------
   SAVE STAGING CONTRACT
   --------------------------------
   */

   const stagingContract =
      await prisma.stagingContract.create({
         data: {

            batchId,

            stagingClientId,

            providerSubjectNo:
               contract.providerSubjectNo,

            contractNo:
               contract.contractNo,
            
            contractStartDate: 
               contract.contractStartDate,
            contractRequestDate: 
               contract.contractRequestDate,

            contractEndPlannedDate:
               contract.contractEndPlannedDate,

            contractEndActualDate:
               contract.contractEndPlannedDate,

            lastPaymentDate: 
               contract.lastPaymentDate,

            financedAmount:
               contract.financedAmount,
            installmentsNumber: 
               contract.installmentsNumber,

            monthlyPaymentAmount: 
               contract.monthlyPaymentAmount,

            firstPaymentDate:
               contract.firstPaymentDate,
            lastPaymentAmount:
               contract.lastPaymentAmount,
            nextPaymentDate:
               contract.nextPaymentDate,
            nextPaymentAmount:
               contract.nextPaymentAmount,
            outstandingPaymentNumber:
               contract.outstandingPaymentNumber,
            outstandingBalance:
               contract.outstandingBalance,

            contractStatus:
               contract.contractStatus,

            validationStatus
         }
      });

   /*
   --------------------------------
   SAVE VALIDATION ERRORS
   --------------------------------
   */

   if (validationErrors.length > 0) {

      await prisma.validationError.createMany({
         data:
            validationErrors.map(
               (err: any) => ({
                  stagingContractId:
                     stagingContract.id,

                  fieldName:
                     err.fieldName,

                  errorMessage:
                     err.errorMessage
               })
            )
      });

   }

   return stagingContract;
};