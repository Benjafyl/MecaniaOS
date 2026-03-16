import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  className?: string;
};

export function FormMessage({ message, className }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-lg border border-[rgba(185,28,28,0.14)] bg-[rgba(185,28,28,0.06)] px-4 py-3 text-sm text-[#991b1b]",
        className,
      )}
    >
      {message}
    </p>
  );
}
