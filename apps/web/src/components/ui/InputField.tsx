// components/ui/InputField.tsx

import {
    FieldError
 } from "react-hook-form";
 
 type Props =
    React.InputHTMLAttributes<HTMLInputElement> & {
 
       label: string;
 
       error?: FieldError;
       containerClassName?: string;
 
    };
 
 export default function InputField({
 
    label,
 
    error,
 
    className,

    containerClassName,
    ...props
 
 }: Props) {
 
    return (
 
       <div
         className={`
            flex
            flex-col
            gap-1
            ${containerClassName || ""}
         `}
       >
 
          <label
             className="
                text-sm
                font-medium
             "
          >
             {label}
          </label>
 
          <input
 
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
          />
 
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