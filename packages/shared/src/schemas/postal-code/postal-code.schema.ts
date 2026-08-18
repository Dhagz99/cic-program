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



  export const createPostalCodeSchema =
    z.object({
      regionName:z.
        string().min(1, "Region name is required."),
      provinceName:z.
        string().min(1, "Province name is required."),
      municipalityName:z.
        string().min(1, "Municipality name is required."),
      zipCode:z.
        string().min(1, "Zip code name is required."),
      normalizedProvince:z.
        string().min(1, "Province name is required."),
      normalizedMunicipality:z.
        string().min(1, "Municipality name is required."),
      source:z.
        string().min(1, "Source name is required.").default("MANUAL"),
    });


  export type CreatePostalCodeInput =
      z.infer<
        typeof createPostalCodeSchema
      >;

