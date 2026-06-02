import {
    TrendingUp,
    TrendingDown
 } from "lucide-react";
 
 type GrowthIndicatorProps = {
 
    value: number;
 
 };
 
 export default function GrowthIndicator({
    value
 }: GrowthIndicatorProps) {
 
    const isPositive =
       value > 0;
 
    const isNegative =
       value < 0;
 
    return (
 
       <div className="
          mt-6
          flex
          items-center
          gap-2
          text-sm
       ">
 
          {isPositive && (
 
             <TrendingUp
                className="
                   text-green-500
                "
                size={16}
             />
 
          )}
 
          {isNegative && (
 
             <TrendingDown
                className="
                   text-red-500
                "
                size={16}
             />
 
          )}
 
          {!isPositive &&
           !isNegative && (
 
             <span
                className="
                   w-4
                   text-center
                   text-slate-400
                "
             >
                —
             </span>
 
          )}
 
          <span
             className={`
                font-medium
                ${
                   isPositive
                      ? "text-green-600"
                      : isNegative
                      ? "text-red-600"
                      : "text-slate-500"
                }
             `}
          >
             {value > 0 ? "+" : ""}
             {value}%
          </span>
 
          <span className="
             text-slate-500
          ">
             vs previous month
          </span>
 
       </div>
 
    );
 
 }