// hooks/imports/useImportDbf.ts

import { useMutation } from "@tanstack/react-query";

import { importDbfService } from "@/services/imports/import.service";

export const useImportDbf = () => {
  return useMutation({
    mutationFn: (formData: FormData) =>
      importDbfService(formData),
  });
};