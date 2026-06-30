import { LucideIcon } from "lucide-react"

export type MenuChild = {
  label: string
  path: string
  icon: LucideIcon
  permission?: string
}


export interface MenuItem {
  label: string
  path?: string
  icon: LucideIcon
  permission?: string
  children?: MenuItem[]
  activePaths?: string[];
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

