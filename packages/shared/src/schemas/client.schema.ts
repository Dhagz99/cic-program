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
         .min(1, "Civil status is required"),

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

      contactType:
          z
            .string()
            .trim()
            .optional(),
      
      contactValue:
           z
            .string()
            .trim()
            .optional(),
       
});
 
 export type UpdateClientDTO =
    z.infer<
       typeof updateClientSchema
    >;


    export type UpdateClientFormValues =
   z.input<
      typeof updateClientSchema
   >;