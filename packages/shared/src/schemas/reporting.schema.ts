import { z } from "zod";

export const reportingStatusSchema = z.enum([
  "OPEN",
  "CLOSED",
  "FINALIZED",
]);

export const createReportingPeriodSchema = z.object({
  month: z.coerce
    .number()
    .int("Month must be a whole number")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),

  year: z.coerce
    .number()
    .int("Year must be a whole number")
    .min(2000, "Year must be at least 2000")
    .max(2100, "Year must not exceed 2100"),

  status: reportingStatusSchema.default("OPEN"),
});

export type CreateReportingPeriodInput = z.input<
  typeof createReportingPeriodSchema
>;

export type ReportingStatus = z.infer<
  typeof reportingStatusSchema
>;