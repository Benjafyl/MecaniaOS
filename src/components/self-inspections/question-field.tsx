import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QuestionFieldProps = {
  label: string;
  helpText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function QuestionField({ label, helpText, error, children, className }: QuestionFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">{label}</p>
        {helpText ? (
          <p className="text-xs leading-5 text-[color:var(--muted)]">{helpText}</p>
        ) : null}
      </div>
      {children}
      {error ? <p className="text-xs text-[color:var(--accent-strong)]">{error}</p> : null}
    </div>
  );
}
