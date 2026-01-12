import * as React from "react";
import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";

// Wrapper component to match the old Dropdown API
interface DropdownProps {
  className?: string;
  drop?: "down" | "up" | "left" | "right";
  children: React.ReactNode;
}

function DropdownRoot({ className, children }: DropdownProps) {
  return (
    <DropdownMenuPrimitive>
      <div className={cn("relative", className)}>{children}</div>
    </DropdownMenuPrimitive>
  );
}

function DropdownToggle({
  className,
  id,
  children,
  ...props
}: React.ComponentProps<"button"> & { id?: string }) {
  return (
    <DropdownMenuTrigger
      id={id}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </DropdownMenuTrigger>
  );
}

function DropdownMenuComponent({
  align = "start",
  children,
  ...props
}: {
  align?: "start" | "end" | "center";
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuContent align={align} {...props}>
      {children}
    </DropdownMenuContent>
  );
}

function DropdownItem({
  href,
  onClick,
  children,
  ...props
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <DropdownMenuItem asChild>
        <a href={href} onClick={onClick} {...props}>
          {children}
        </a>
      </DropdownMenuItem>
    );
  }
  return (
    <DropdownMenuItem onClick={onClick} {...props}>
      {children}
    </DropdownMenuItem>
  );
}

function DropdownDivider() {
  return <DropdownMenuSeparator />;
}

export const Dropdown = Object.assign(DropdownRoot, {
  Toggle: DropdownToggle,
  Menu: DropdownMenuComponent,
  Item: DropdownItem,
  Divider: DropdownDivider,
});
