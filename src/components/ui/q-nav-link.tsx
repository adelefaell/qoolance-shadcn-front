
import { Link, type LinkProps } from "react-router";
import { cn } from "@/lib/utils";

interface QNavLinkProps extends LinkProps {
  activeClassName?: string;
}

export function QNavLink({ className, ...props }: QNavLinkProps) {
  return (
    <Link
      className={cn(
        "text-gray-700 hover:text-primary font-medium capitalize transition-colors",
        className
      )}
      {...props}
    />
  );
}
