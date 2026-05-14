type Props = {

    count: number;
 
 };
 
 export default function ErrorCountBadge({
    count
 }: Props) {
 
    return (
 
       <span className={`
          px-2
          py-1
          rounded-full
          text-xs
          font-bold
 
          ${
             count > 0
 
             ? "bg-red-100 text-red-700"
 
             : "bg-green-100 text-green-700"
          }
       `}>
 
          {count}
 
       </span>
 
    );
 
 }