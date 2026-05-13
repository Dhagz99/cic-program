
import api from "@/lib/axios";

export const importDbfService = async (
  formData: FormData
) => {
  const res = await api.post(
    "/dbf/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};