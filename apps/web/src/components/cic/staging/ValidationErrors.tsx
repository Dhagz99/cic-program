type Props = {

    errors: any[];
 
 };
 
 export default function ValidationErrors({
    errors
 }: Props) {
 
    if (!errors?.length) {
 
       return null;
 
    }
 
    return (
 
       <div className="
          bg-red-100
          border
          border-red-300
          rounded-lg
          p-4
          mt-4
       ">
 
          <ul className="
             text-sm
             text-red-700
             space-y-1
          ">
 
             {errors.map((error) => (
 
                <li key={error.id}>
 
                   • {error.errorMessage}
 
                </li>
 
             ))}
 
          </ul>
 
       </div>
 
    );
 
 }