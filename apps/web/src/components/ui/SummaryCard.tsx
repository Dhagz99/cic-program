export function SummaryCard({
    title,
    value,
    icon,
    iconClass,
 }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    iconClass: string;
 }) {
    return (
       <div className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          p-6
          shadow-sm
       ">
          <div className="
             flex
             items-start
             justify-between
          ">
             <div>
                <p className="
                   text-slate-500
                   text-sm
                ">
                   {title}
                </p>
 
                <h2 className="
                   text-2xl
                   font-bold
                   text-slate-800
                   mt-3
                ">
                   {value}
                </h2>
             </div>
 
             <div className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                ${iconClass}
             `}>
                {icon}
             </div>
          </div>
       </div>
    );
 }