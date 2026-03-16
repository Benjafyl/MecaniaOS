import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
