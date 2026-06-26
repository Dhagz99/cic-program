import { MenuSection } from "@repo/shared"
import {
  FileText,
  FolderPlus,
    LayoutDashboard,
    Users,
    WalletCards
  } from "lucide-react"

  
export const MENU_SECTIONS: MenuSection[] = [

    {
      title: "Menu",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard
        },
        {
          label: "Borrowers",
          path: "/borrowers",
          icon: Users,
          permission:"CLIENT_VIEW"
        },
        {
          label: "Loans",
          path: "/loans",
          icon: WalletCards,
          permission:"CONTRACT_VIEW"
        },
        {
          label: "Initialize",
          path: "/cic/upload",
          icon: FolderPlus,
          permission:"STAGING_UPLOAD"
        },
        {
          label: "Reports",
          path: "/reports",
          icon: FileText,
          permission:"REPORT_VIEW"
        },
        // {
        //   label: "Payroll",
        //   icon: Calculator,
        //   children: [
        //     {
        //       label: "Run Payroll",
        //       path: "/main-payroll",
        //       icon: Calculator,
        //       permission:"ADMIN_MANAGE"
        //     },
        //     {
        //       label: "Payroll Archive",
        //       path: "/archive-payroll",
        //       icon: Archive,
        //       permission:"ADMIN_MANAGE"
        //     },
          
        //   ]
        // },
      ]
    },
   
  ]
  