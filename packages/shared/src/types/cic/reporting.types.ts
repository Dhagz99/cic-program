export type ReportingPeriodType = {
    id: string;
    month: number;
    year: number;
    status: "OPEN" | "CLOSED" | "FINALIZED";
    createdAt: string;
    updatedAt: string | null;
  };