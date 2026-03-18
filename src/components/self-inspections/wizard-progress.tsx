import { SELF_INSPECTION_WIZARD_STEPS } from "@/modules/self-inspections/self-inspection.constants";

type WizardProgressProps = {
  currentStep: number;
  completionPercent: number;
};

export function WizardProgress({ currentStep, completionPercent }: WizardProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">
          Paso {currentStep} de {SELF_INSPECTION_WIZARD_STEPS.length - 1}
        </p>
        <p className="text-sm text-[color:var(--muted)]">{completionPercent}% completado</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-strong))] transition-[width] duration-300"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <div className="grid gap-2 md:grid-cols-5 xl:grid-cols-9">
        {SELF_INSPECTION_WIZARD_STEPS.slice(0, -1).map((step, index) => {
          const stepNumber = index + 1;

          return (
            <div
              className={`rounded-2xl border px-3 py-2 text-xs ${
                stepNumber === currentStep
                  ? "border-[color:var(--accent)] bg-[rgba(200,92,42,0.1)] text-[color:var(--accent-strong)]"
                  : stepNumber < currentStep
                    ? "border-[rgba(14,79,82,0.18)] bg-[rgba(14,79,82,0.08)] text-[color:var(--success)]"
                    : "border-[color:var(--border)] bg-white/75 text-[color:var(--muted)]"
              }`}
              key={step.key}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
