import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "warning" | "success" | "info";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-[color:var(--surface-strong)] text-[color:var(--foreground)]",
        tone === "warning" && "bg-[rgba(200,92,42,0.12)] text-[color:var(--accent-strong)]",
        tone === "success" && "bg-[rgba(14,79,82,0.12)] text-[color:var(--success)]",
        tone === "info" && "bg-[rgba(18,77,150,0.1)] text-[color:var(--info)]",
        className,
      )}
      {...props}
    />
  );
}
