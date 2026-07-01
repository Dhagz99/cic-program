import { Branch } from "../../schemas/branch.schema";
import { ReportingPeriodType } from "./reporting.types";

export type BatchStatus =
  | "PROCESSING"
  | "PENDING_COMPLETION"
  | "FOR_REVIEW"
  | "APPROVED"
  | "RETURNED"
  | "REJECTED"
  | "FINALIZED";


export interface ImportBatchItem {

   id: string;

   status: string;

   totalRecords: number;

   completedRecords: number;

   fileName?: string;

   errorRecords: number;

   createdAt: string;

   branch: {
      id: string;
      branchName: string;
   };
   reportingPeriod: {
      id: string;
      month: string;
      year: string;
   };

};

export type ReportingPeriod = {

   id: string;

   month: number;

   year: number;

   name: string;

};


export type BatchUser = {
   id: string;
   name: string;
   username: string;
   email: string | null;
 };


 export type ImportBatchDetails = {
   id: string;
   branchId: string;
   reportingPeriodId: string;
   uploadedById: string;
 
   fileName: string;
   originalFilePath: string;
   status: BatchStatus;
 
   totalRecords: number;
   completedRecords: number;
   errorRecords: number;
 
   submittedAt: string | null;
   submittedById: string | null;
 
   approvedAt: string | null;
   approvedById: string | null;
 
   returnedAt: string | null;
   returnedById: string | null;
   returnReason: string | null;
 
   rejectedAt: string | null;
   rejectedById: string | null;
   rejectionReason: string | null;
 
   createdAt: string;
   updatedAt: string;
 
   branch: Branch;
   reportingPeriod: ReportingPeriodType;
   uploadedBy: BatchUser;
 };
 
 export type GetBatchByIdResponse = {
   success: boolean;
   data: ImportBatchDetails;
 };