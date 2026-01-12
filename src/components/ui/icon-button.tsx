import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Link } from "react-router"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"

// Simple icon mapping for common icons
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "fa6-solid:envelope": Mail,
  "ic:round-policy": () => <span>📄</span>,
  "fa6-solid:pen-to-square": () => <span>✏️</span>,
  "fa6-solid:ellipsis-vertical": () => <span>⋯</span>,
}

interface IconButtonProps extends Omit<React.ComponentProps<typeof Button>, "children"> {
  icon: string | React.ReactNode
  asChild?: boolean
}

export function IconButton({
  icon,
  className,
  asChild = false,
  to,
  ...props
}: IconButtonProps) {
  const IconComponent =
    typeof icon === "string" ? iconMap[icon] || (() => <span>{icon}</span>) : null
  const iconElement =
    typeof icon === "string" ? (
      IconComponent ? <IconComponent className="size-6" /> : <span>{icon}</span>
    ) : (
      icon
    )

  if (asChild) {
    return <Slot {...props}>{iconElement}</Slot>
  }

  if (to) {
    return (
      <Link
        to={to}
        className={cn(
          "inline-flex items-center justify-center size-9 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...(props as any)}
      >
        {iconElement}
      </Link>
    )
  }

  return (
    <Button
      size="icon"
      className={cn(className)}
      {...props}
    >
      {iconElement}
    </Button>
  )
}
