import { zodResolver } from "@hookform/resolvers/zod";
import { BranchSchema, createBranchSchema } from "@repo/shared";
import { useForm } from "react-hook-form";
import { InputField } from "../FormInputs";

interface Props {
    onSubmit: (
        data: BranchSchema
    )=> Promise<void>;
    
    isLoading: boolean;
}

export function BranchForm({
    onSubmit,
    isLoading
} : Props){

    const form = useForm<BranchSchema>({
        resolver: zodResolver(createBranchSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
          branchCode: "",
          branchName: "",
        },
      });

    return(
        <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="space-y-4"
>
  <InputField
    label="Branch Code"
    {...form.register("branchCode")}
    error={form.formState.errors.branchCode?.message}
  />

  <InputField
    label="Branch Name"
    {...form.register("branchName")}
    error={form.formState.errors.branchName?.message}
  />

  <button
    type="submit"
    disabled={isLoading}
    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {isLoading ? "Saving..." : "Save Branch"}
  </button>
</form>
    )

}