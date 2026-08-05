import { z } from "zod";

export const updateClientPostalCodeItemSchema =
  z.object({
    clientId: z.string().uuid(),

    postalCode: z
      .string()
      .regex(
        /^\d{4}$/,
        "Postal code must contain four digits"
      )
  });

export const updateClientPostalCodesSchema =
  z.object({
    items: z
      .array(
        updateClientPostalCodeItemSchema
      )
      .min(
        1,
        "At least one client must be selected"
      )
  });

export type UpdateClientPostalCodesDTO =
  z.infer<
    typeof updateClientPostalCodesSchema
  >;