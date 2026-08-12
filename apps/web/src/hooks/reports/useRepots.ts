import { exportReport } from "@/services/cic/report.service";
import { getTimestamp } from "@/utils/date/getTimestamp";
import { ExportValidationResponse } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export function useExportReport() {
  const queryClient = useQueryClient();

  return useMutation<
    Blob,
    ExportValidationResponse,
    string
  >({
    mutationFn: (batchId: string) =>
      exportReport(batchId),

    onSuccess: (blob) => {
      const timestamp = getTimestamp();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `PF007980_CSDF_${timestamp}.txt`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      console.error(
        "Export failed:",
        error
      );
    },
  });
}