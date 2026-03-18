import { SelfInspectionRiskLevel } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { SELF_INSPECTION_RISK_LABELS } from "@/modules/self-inspections/self-inspection.constants";

export function SelfInspectionRiskBadge({
  level,
}: {
  level: SelfInspectionRiskLevel;
}) {
  const tone =
    level === SelfInspectionRiskLevel.LOW
      ? "neutral"
      : level === SelfInspectionRiskLevel.MEDIUM
        ? "info"
        : "warning";

  return (
    <Badge
      className={level === SelfInspectionRiskLevel.CRITICAL ? "bg-[rgba(148,33,33,0.12)] text-[#8d1f1f]" : undefined}
      tone={tone}
    >
      Riesgo {SELF_INSPECTION_RISK_LABELS[level]}
    </Badge>
  );
}
