"use client";

import { cn } from "@/lib/utils";

type ChoiceSegmentFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  columns?: 2 | 3;
  disabled?: boolean;
};

export function ChoiceSegmentField({
  value,
  onChange,
  options,
  columns = 2,
  disabled,
}: ChoiceSegmentFieldProps) {
  return (
    <div className={cn("grid gap-3", columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {options.map((option) => (
        <button
          className={cn(
            "min-h-11 rounded-2xl border px-4 text-left text-sm font-semibold transition",
            value === option.value
              ? "border-[color:var(--accent)] bg-[rgba(200,92,42,0.1)] text-[color:var(--accent-strong)]"
              : "border-[color:var(--border)] bg-white/80 text-[color:var(--muted-strong)] hover:bg-white",
          )}
          disabled={disabled}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
