type Props = {

    status: string;
 
 };
 
 export default function ValidationBadge({
    status
 }: Props) {
 
    return (
 
       <span className={`
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
 
          ${
             status === "COMPLETE"
 
             ? "bg-green-100 text-green-700"
 
             : "bg-red-100 text-red-700"
          }
       `}>
 
          {status}
 
       </span>
 
    );
 
 }