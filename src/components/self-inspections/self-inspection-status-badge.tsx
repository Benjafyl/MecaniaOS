import { SelfInspectionStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { SELF_INSPECTION_STATUS_LABELS } from "@/modules/self-inspections/self-inspection.constants";

export function SelfInspectionStatusBadge({ status }: { status: SelfInspectionStatus }) {
  const tone =
    status === SelfInspectionStatus.REVIEWED ||
    status === SelfInspectionStatus.CONVERTED_TO_WORK_ORDER
      ? "success"
      : status === SelfInspectionStatus.SUBMITTED ||
          status === SelfInspectionStatus.UNDER_REVIEW
        ? "info"
        : status === SelfInspectionStatus.IN_PROGRESS
          ? "warning"
          : "neutral";

  return <Badge tone={tone}>{SELF_INSPECTION_STATUS_LABELS[status]}</Badge>;
}
