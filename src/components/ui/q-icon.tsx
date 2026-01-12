import * as React from "react"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "fa6-solid:ellipsis-vertical": MoreVertical,
}

interface QIconProps {
  icon: string
  className?: string
  size?: number | string
}

export function QIcon({ icon, className, size = 16 }: QIconProps) {
  const IconComponent = iconMap[icon]
  
  if (IconComponent) {
    return <IconComponent className={cn(className)} size={typeof size === "number" ? size : parseInt(size)} />
  }
  
  return (
    <span className={cn("inline-block", className)} style={{ width: size, height: size }}>
      {icon}
    </span>
  )
}
