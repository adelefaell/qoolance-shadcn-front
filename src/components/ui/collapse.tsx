import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapseProps {
  id?: string
  open: boolean
  children: React.ReactNode
  className?: string
}

export function Collapse({ id, open, children, className }: CollapseProps) {
  return (
    <div
      id={id}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
