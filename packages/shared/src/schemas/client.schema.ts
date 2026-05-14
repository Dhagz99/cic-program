import {
    z
 } from "zod";
 
 export const updateClientSchema =
    z.object({
 
       firstName:
          z.string()
          .min(1),
 
       middleName:
          z.string()
          .min(1),
 
       lastName:
          z.string()
          .min(1),
 
       gender:
          z.string()
          .min(1),
 
       civilStatus:
          z.string()
          .min(1),
 
       tinNumber:
          z.string()
 
    });
 
 export type UpdateClientDTO =
    z.infer<
       typeof updateClientSchema
    >;