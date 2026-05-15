// components/ui/SelectField.tsx

import {
    FieldError
 } from "react-hook-form";
 
 type Option = {
 
    label: string;
    value: string;
 
 };
 
 type Props =
    React.SelectHTMLAttributes<HTMLSelectElement> & {
 
       label: string;
 
       options: Option[];
 
       error?: FieldError;
 
    };
 
 export default function SelectField({
 
    label,
 
    options,
 
    error,
 
    className,
 
    ...props
 
 }: Props) {
 
    return (
 
       <div
          className="
             flex
             flex-col
             gap-1
          "
       >
 
          <label
             className="
                text-sm
                font-medium
             "
          >
             {label}
          </label>
 
          <select
 
             {...props}
 
             className={`
                border
                rounded-lg
                px-3
                py-2
                outline-none
                focus:ring-2
                focus:ring-blue-500
                ${error
                   ? "border-red-500"
                   : "border-gray-300"
                }
                ${className || ""}
             `}
          >
 
             <option value="">
                Select {label}
             </option>
 
             {
                options.map((option) => (
 
                   <option
                      key={option.value}
                      value={option.value}
                   >
                      {option.label}
                   </option>
 
                ))
             }
 
          </select>
 
          {
             error && (
 
                <p
                   className="
                      text-red-500
                      text-sm
                   "
                >
                   {error.message}
                </p>
 
             )
          }
 
       </div>
 
    );
 
 }