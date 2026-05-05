import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  tone?: "error" | "success" | "info";
  className?: string;
};

export function FormMessage({
  message,
  tone = "error",
  className,
}: FormMessageProps) {
  if (!message) {
    return null;
  }

  const toneClass =
    tone === "success"
      ? "border-[rgba(22,163,74,0.18)] bg-[rgba(22,163,74,0.08)] text-[#166534]"
      : tone === "info"
        ? "border-[rgba(37,99,235,0.18)] bg-[rgba(37,99,235,0.08)] text-[#1d4ed8]"
        : "border-[rgba(185,28,28,0.14)] bg-[rgba(185,28,28,0.06)] text-[#991b1b]";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-[0_10px_24px_rgba(15,23,42,0.04)]",
        toneClass,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          tone === "success"
            ? "bg-[rgba(22,163,74,0.12)] text-[#166534]"
            : tone === "info"
              ? "bg-[rgba(37,99,235,0.12)] text-[#1d4ed8]"
              : "bg-[rgba(185,28,28,0.10)] text-[#991b1b]",
        )}
      >
        {tone === "success" ? "OK" : tone === "info" ? "i" : "!"}
      </span>
      <p className="leading-6">{message}</p>
    </div>
  );
}
