import { BudgetStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { BUDGET_STATUS_LABELS } from "@/modules/budgets/budget.constants";

export function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  const tone =
    status === BudgetStatus.APPROVED || status === BudgetStatus.CONVERTED_TO_WORK_ORDER
      ? "success"
      : status === BudgetStatus.SENT
        ? "warning"
        : "info";

  return (
    <Badge
      className={
        status === BudgetStatus.REJECTED ? "bg-[rgba(185,28,28,0.10)] text-[#991b1b]" : undefined
      }
      tone={tone}
    >
      {BUDGET_STATUS_LABELS[status]}
    </Badge>
  );
}
