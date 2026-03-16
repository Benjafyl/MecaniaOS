import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "warning" | "success" | "info";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        tone === "neutral" && "bg-[color:var(--surface-strong)] text-[color:var(--muted-strong)]",
        tone === "warning" && "bg-[rgba(37,99,235,0.10)] text-[#1d4ed8]",
        tone === "success" && "bg-[rgba(15,23,42,0.06)] text-[#1e3a8a]",
        tone === "info" && "bg-[rgba(59,130,246,0.12)] text-[#2563eb]",
        className,
      )}
      {...props}
    />
  );
}
