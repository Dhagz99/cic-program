import { useCreateBranches } from "@/hooks/useGeneral"
import { BranchSchema } from "@repo/shared";
import { toast } from "sonner";
import { BranchForm } from "./BranchForm";
  
interface Props {
    onClose: ()=>void
}
export default function CreateBranchModal({
    onClose
}: Props){
        const {mutateAsync: createBranch, isPending} = useCreateBranches();

        const handleSubmit = async (
            data: BranchSchema
        )=>{
            try{
                await createBranch(data);
                toast.success(
                    "Branch created successfully"
                );
                 onClose();

            }catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Something went wrong"
                );
              }
        };
        return(
            <div className="">
                <BranchForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                />
             </div>
        );
}

