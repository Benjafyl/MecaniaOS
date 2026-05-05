import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex w-fit touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(36,88,198,0.14)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        size === "md" && "min-h-11 px-5 py-2.5",
        size === "sm" && "min-h-9 px-3.5 text-xs",
        variant === "primary" &&
          "bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_100%)] text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] hover:shadow-[0_18px_36px_rgba(37,99,235,0.26)]",
        variant === "secondary" &&
          "border-[color:var(--border-strong)] bg-white/[0.9] text-[var(--foreground)] shadow-[0_8px_20px_rgba(15,23,42,0.05)] hover:border-[#2563eb] hover:bg-white",
        variant === "ghost" &&
          "text-[var(--muted-strong)] hover:bg-[color:var(--surface-strong)] hover:text-[var(--foreground)]",
        variant === "danger" &&
          "border-[rgba(185,28,28,0.18)] bg-[rgba(185,28,28,0.08)] text-[#991b1b] shadow-[0_8px_20px_rgba(185,28,28,0.08)] hover:border-[rgba(185,28,28,0.3)] hover:bg-[rgba(185,28,28,0.12)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
