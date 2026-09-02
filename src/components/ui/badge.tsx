import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "sale" | "new";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
    secondary:
      "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
    destructive:
      "border-transparent bg-rose-500 text-neutral-50 hover:bg-rose-500/80 dark:bg-rose-900 dark:text-neutral-50 dark:hover:bg-rose-900/80",
    outline: "text-neutral-950 dark:text-neutral-50 border-neutral-200 dark:border-neutral-800",
    sale: "border-transparent bg-rose-500 text-white font-black tracking-wider shadow-sm shadow-rose-500/30 animate-pulse",
    new: "border-transparent bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-black tracking-wider",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
