"use client";

import { cn } from "@/lib/utils";

type BooleanSegmentFieldProps = {
  value?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function BooleanSegmentField({
  value,
  onChange,
  disabled,
}: BooleanSegmentFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Si", nextValue: true },
        { label: "No", nextValue: false },
      ].map((option) => (
        <button
          className={cn(
            "min-h-11 rounded-2xl border px-4 text-sm font-semibold transition",
            value === option.nextValue
              ? "border-[color:var(--accent)] bg-[rgba(200,92,42,0.1)] text-[color:var(--accent-strong)]"
              : "border-[color:var(--border)] bg-white/80 text-[color:var(--muted-strong)] hover:bg-white",
          )}
          disabled={disabled}
          key={option.label}
          onClick={() => onChange(option.nextValue)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
