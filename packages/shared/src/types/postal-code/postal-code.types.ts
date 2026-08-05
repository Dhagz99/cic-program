export type PostalAuditStatus =
  | "CORRECT"
  | "MISSING"
  | "MISMATCH"
  | "UNRESOLVED";

export type ClientPostalAuditItem = {
  clientId: string;
  providerSubjectNo: string | null;
  clientName: string;
  address: string | null;

  currentPostalCode: string | null;
  detectedPostalCode: string | null;

  matchedProvince: string | null;
  matchedMunicipality: string | null;

  status: PostalAuditStatus;
  message: string;
};

export type ClientPostalAuditSummary = {
  total: number;
  correct: number;
  missing: number;
  mismatch: number;
  unresolved: number;
};

export type ClientPostalAuditResponse = {
  branchId: string;
  summary: ClientPostalAuditSummary;
  data: ClientPostalAuditItem[];
};

export type UpdateClientPostalCodeItem = {
  clientId: string;
  postalCode: string;
};

export type UpdateClientPostalCodesPayload = {
  items: UpdateClientPostalCodeItem[];
};