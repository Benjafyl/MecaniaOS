import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-lg border border-[color:var(--border)] bg-white px-4 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
