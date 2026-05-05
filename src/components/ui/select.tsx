import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 pr-10 text-sm text-[color:var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)] disabled:cursor-not-allowed disabled:bg-[color:var(--surface-strong)] disabled:text-[color:var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
