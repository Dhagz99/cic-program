import {
    z
 } from "zod";
 
 export const updateClientSchema =
    z.object({
      firstName:
      z
         .string()
         .trim()
         .min(1, "First name is required")
         .max(100, "First name is too long"),

   middleName:
      z
         .string()
         .trim()
         .optional(),

   lastName:
      z
         .string()
         .trim()
         .min(1, "Last name is required")
         .max(100, "Last name is too long"),

   suffix:
      z
         .string()
         .trim()
         .optional(),
      

   gender:
      z
         .string()
         .trim()
         .min(1, "Gender is required"),
   birthDate:
         z
            .string()
            .min(1, "Birth date is required"),
   placeOfBirth:
            z
               .string()
               .trim()
               .optional(),
            
            
      civilStatus:
         z
            .string()
            .trim()
            .min(1,
               "Civil status is required"
            ),
   numberOfDependents:
      z
         .number()
         .optional(),


   addressType:
    z
      .string()
      .trim()
      .optional(),

   address:
     z
      .string()
      .trim()
      .optional(),

   addressType2:
      z
        .string()
        .trim()
        .optional(),
  
   address2:
       z
        .string()
        .trim()
        .optional(),


   identificationType:
      z
      .string()
      .trim()
      .min(1, "Identification type is required"),
      
   identificationNumber:
      z
         .string()
         .trim()
         .min(1, "Identification number is required"),

secondaryIdentificationType:
   z
   .string()
   .trim()
   .optional(),
   
   secondaryIdentificationNumber:
   z
      .string()
      .trim()
      .optional(),     

   contactType:
         z
         .string()
         .trim()
         .min(1, "Contact type is required"),
      
   contactValue:
         z
         .string()
         .trim()
         .min(1, "Contact value is required"),
       
});
 
 export type UpdateClientDTO =
    z.infer<
       typeof updateClientSchema
    >;


    export type UpdateClientFormValues =
   z.input<
      typeof updateClientSchema
   >;


   // schemas/cic/loan.schema.ts


export const updateLoanSchema = z.object({

   contractNo:
      z
         .string()
         .min(
            1,
            "Contract number is required"
         ),

   contractType:
      z
         .number()
         .optional(),

   contractPhase:
      z
         .string()
         .optional(),

   contractStatus:
      z
         .string()
         .optional(),

   currency:
      z
         .string()
         .optional(),

   originalCurrency:
      z
         .string()
         .optional(),



   contractStartDate:
      z
         .string()
         .optional(),

   contractRequestDate:
      z
         .string()
         .optional(),

   contractEndPlannedDate:
      z
         .string()
         .optional(),

   contractEndActualDate:
      z
         .string()
         .optional(),

   firstPaymentDate:
      z
         .string()
         .optional(),

   lastPaymentDate:
      z
         .string()
         .optional(),

   nextPaymentDate:
      z
         .string()
         .optional(),



   financedAmount:
      z
         .number()
         .min(1),

   installmentsNumber:
      z
         .number()
         .optional(),

   monthlyPaymentAmount:
      z
         .number()
         .optional(),

   lastPaymentAmount:
      z
         .number()
         .optional(),

   nextPaymentAmount:
      z
         .number()
         .optional(),

   outstandingBalance:
      z
         .number()
         .optional(),

   overduePaymentAmount:
      z
         .number()
         .optional(),

 
   outstandingPaymentNumber:
      z
         .number()
         .optional(),

   overduePaymentNumber:
      z
         .number()
         .optional(),

   paymentPeriodicity:
      z
         .string()
         .optional(),

   paymentMethod:
      z
         .string()
         .optional(),

   transactionType:
      z
         .string()
         .optional()

});

export type UpdateLoanFormValues =
   z.infer<
      typeof updateLoanSchema
   >;