


export interface ImportBatchItem {

   id: string;

   status: string;

   totalRecords: number;

   completedRecords: number;

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