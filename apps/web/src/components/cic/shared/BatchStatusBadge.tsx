type Props = {

    status: string;
 
 };
 
 export default function BatchStatusBadge({
    status
 }: Props) {
 
    const getColor = () => {
 
       switch (status) {
 
          case "PENDING_COMPLETION":
             return "bg-orange-500";
 
          case "FOR_REVIEW":
             return "bg-blue-500";
 
          case "APPROVED":
             return "bg-green-600";
 
          case "RETURNED":
             return "bg-red-600";
 
          case "FINALIZED":
             return "bg-purple-600";
 
          default:
             return "bg-gray-500";
 
       }
 
    };
 
    return (
 
       <span
          className={`
             ${getColor()}
             text-white
             px-3
             py-1
             rounded-full
             text-sm
          `}
       >
          {status}
       </span>
 
    );
 
 }