import {
    useMutation,
    useQuery
 } from "@tanstack/react-query";
 
 import {
    exportReport,
    getImportBatches,
    getReportingPeriods
 } from "@/services/cic/report.service";
import { ImportBatchItem, ReportingPeriod } from "@repo/shared";
 
 export const useExportReport =
 () => {
 
    return useMutation({
 
       mutationFn:
          exportReport
 
    });
 
 };

 export const useImportBatches =
() => {

   return useQuery<ImportBatchItem[]>({

      queryKey: [
         "import-batches"
      ],

      queryFn:
         getImportBatches

   });

};


export const useReportingPeriods =
() => {

   return useQuery<ReportingPeriod[]>({

      queryKey: [
         "reporting-periods"
      ],

      queryFn:
         getReportingPeriods

   });

};
