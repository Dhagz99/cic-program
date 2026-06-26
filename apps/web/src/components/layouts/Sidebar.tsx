"use client";

import Link from "next/link";

import {
   ChevronDown,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { MENU_SECTIONS } from "./menu.config";
import { useAuth } from "../context/UserContext";

interface SidebarProps {
   isOpen: boolean;
   onToggle: () => void;
}

export default function Sidebar({
   isOpen,
   onToggle,
}: SidebarProps) {
   const pathname = usePathname();

   const { hasPermission } = useAuth();

   const [openMenus, setOpenMenus] = useState<
      Record<string, boolean>
   >({
      Payroll: true,
   });

   const toggleMenu = (label: string) => {
      setOpenMenus((prev) => ({
         ...prev,
         [label]: !prev[label],
      }));
   };

   const canViewItem = (permission?: string) => {
      if (!permission) return true;

      return hasPermission(permission);
   };

   return (
      <div className="h-full flex flex-col bg-white">
         <div
            className={`
               h-20 border-b border-slate-200
               flex items-center
               px-5
               ${
                  isOpen
                     ? "justify-between"
                     : "justify-center"
               }
            `}
         >
            {isOpen && (
               <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                     C
                  </div>

                  <div className="overflow-hidden">
                     <h1 className="font-bold text-slate-800 whitespace-nowrap">
                        CIC Report
                     </h1>

                     <p className="text-xs text-slate-500 whitespace-nowrap">
                        Lending System
                     </p>
                  </div>
               </div>
            )}

            <button
               onClick={onToggle}
               className="
                  w-10 h-10 rounded-xl
                  hover:bg-slate-100
                  transition
                  flex items-center justify-center
                  text-slate-600
               "
            >
               {isOpen ? (
                  <ChevronLeft size={20} />
               ) : (
                  <ChevronRight size={20} />
               )}
            </button>
         </div>

         <div className="flex-1 overflow-y-auto px-3 py-5">
            {MENU_SECTIONS.map((section) => {
               const visibleItems = section.items.filter(
                  (item) => canViewItem(item.permission)
               );

               if (visibleItems.length === 0) {
                  return null;
               }

               return (
                  <div
                     key={section.title}
                     className="mb-8"
                  >
                     {isOpen && (
                        <h2 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                           {section.title}
                        </h2>
                     )}

                     <div className="flex flex-col gap-1">
                        {visibleItems.map((item) => {
                           const visibleChildren =
                              item.children?.filter((child) =>
                                 canViewItem(child.permission)
                              ) ?? [];

                           const hasChildren =
                              visibleChildren.length > 0;

                           const isActive =
                              item.path &&
                              pathname.startsWith(item.path);

                           const isChildActive =
                              visibleChildren.some((child) =>
                                 pathname.startsWith(
                                    child.path || ""
                                 )
                              );

                           const active =
                              isActive || isChildActive;

                           return (
                              <div key={item.label}>
                                 {hasChildren ? (
                                    <>
                                       <button
                                          onClick={() =>
                                             toggleMenu(item.label)
                                          }
                                          className={`
                                             w-full flex items-center
                                             ${
                                                isOpen
                                                   ? "justify-between"
                                                   : "justify-center"
                                             }
                                             px-4 py-3 rounded-2xl
                                             transition-all duration-200
                                             ${
                                                active
                                                   ? "bg-blue-50 text-blue-600"
                                                   : "text-slate-700 hover:bg-slate-100"
                                             }
                                          `}
                                       >
                                          <div className="flex items-center gap-3">
                                             {item.icon && (
                                                <item.icon size={20} />
                                             )}

                                             {isOpen && (
                                                <span className="text-sm font-medium">
                                                   {item.label}
                                                </span>
                                             )}
                                          </div>

                                          {isOpen && (
                                             <ChevronDown
                                                size={18}
                                                className={`
                                                   transition-transform duration-200
                                                   ${
                                                      openMenus[item.label]
                                                         ? "rotate-180"
                                                         : ""
                                                   }
                                                `}
                                             />
                                          )}
                                       </button>

                                       {openMenus[item.label] &&
                                          isOpen && (
                                             <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-slate-200 pl-4">
                                                {visibleChildren.map(
                                                   (child) => {
                                                      const childActive =
                                                         pathname.startsWith(
                                                            child.path || ""
                                                         );

                                                      return (
                                                         <Link
                                                            key={child.label}
                                                            href={
                                                               child.path ||
                                                               "#"
                                                            }
                                                            className={`
                                                               flex items-center gap-3
                                                               px-4 py-3 rounded-xl
                                                               transition-all
                                                               ${
                                                                  childActive
                                                                     ? "bg-blue-600 text-white shadow-sm"
                                                                     : "text-slate-600 hover:bg-slate-100"
                                                               }
                                                            `}
                                                         >
                                                            {child.icon && (
                                                               <child.icon
                                                                  size={18}
                                                               />
                                                            )}

                                                            <span className="text-sm font-medium">
                                                               {child.label}
                                                            </span>
                                                         </Link>
                                                      );
                                                   }
                                                )}
                                             </div>
                                          )}
                                    </>
                                 ) : (
                                    <Link
                                       href={item.path || "#"}
                                       className={`
                                          flex items-center
                                          ${
                                             isOpen
                                                ? "gap-3"
                                                : "justify-center"
                                          }
                                          px-4 py-3 rounded-2xl
                                          transition-all duration-200
                                          ${
                                             active
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-700 hover:bg-slate-100"
                                          }
                                       `}
                                    >
                                       {item.icon && (
                                          <item.icon size={20} />
                                       )}

                                       {isOpen && (
                                          <span className="text-sm font-medium">
                                             {item.label}
                                          </span>
                                       )}
                                    </Link>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })}
         </div>

         <div className="border-t border-slate-200 p-4">
            <div
               className={`
                  flex items-center
                  ${isOpen ? "gap-3" : "justify-center"}
               `}
            >
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700">
                  N
               </div>

               {isOpen && (
                  <div>
                     <p className="text-sm font-semibold text-slate-800">
                        CIC System
                     </p>

                     <p className="text-xs text-slate-500">
                        Version 1.0
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}