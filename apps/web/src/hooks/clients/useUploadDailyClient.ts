
import { uploadDailyClientFile } from "@/services/client.service";
import { UploadDailyClientResponse } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUploadDailyClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadDailyClientResponse,
    Error,
    File
  >({
    mutationFn: uploadDailyClientFile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["daily-clients"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["import-daily"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["daily-import-batches"],
      });
    },
  });
};