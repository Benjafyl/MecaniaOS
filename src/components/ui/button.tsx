import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl border border-transparent px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(36,88,198,0.14)] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[#2563eb] text-white shadow-[0_12px_28px_rgba(37,99,235,0.18)] hover:bg-[#1d4ed8]",
        variant === "secondary" &&
          "border-[color:var(--border-strong)] bg-white/[0.88] text-[var(--foreground)] hover:border-[#2563eb] hover:bg-white",
        variant === "ghost" &&
          "text-[var(--muted-strong)] hover:bg-[color:var(--surface-strong)] hover:text-[var(--foreground)]",
        variant === "danger" &&
          "border-[rgba(185,28,28,0.18)] bg-[rgba(185,28,28,0.08)] text-[#991b1b] hover:border-[rgba(185,28,28,0.3)] hover:bg-[rgba(185,28,28,0.12)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
