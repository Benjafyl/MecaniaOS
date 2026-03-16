import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-2xl border border-[color:var(--border)] bg-white/85 px-4 text-sm outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[rgba(200,92,42,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
