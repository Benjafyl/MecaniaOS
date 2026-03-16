import { WorkOrderStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { WORK_ORDER_STATUS_LABELS } from "@/modules/work-orders/work-order.constants";

export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const tone =
    status === WorkOrderStatus.READY_FOR_DELIVERY || status === WorkOrderStatus.DELIVERED
      ? "success"
      : status === WorkOrderStatus.WAITING_APPROVAL ||
          status === WorkOrderStatus.WAITING_PARTS
        ? "warning"
        : status === WorkOrderStatus.IN_DIAGNOSIS || status === WorkOrderStatus.IN_REPAIR
          ? "info"
          : "neutral";

  return <Badge tone={tone}>{WORK_ORDER_STATUS_LABELS[status]}</Badge>;
}
