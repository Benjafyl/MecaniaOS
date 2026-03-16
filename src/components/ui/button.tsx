import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
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
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--accent)] text-white shadow-[0_14px_30px_rgba(200,92,42,0.28)] hover:bg-[var(--accent-strong)]",
        variant === "secondary" &&
          "border border-[color:var(--border-strong)] bg-white/80 text-[var(--foreground)] hover:bg-white",
        variant === "ghost" &&
          "text-[var(--foreground)] hover:bg-[color:var(--surface-strong)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
