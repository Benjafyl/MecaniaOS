"use client";

import { BudgetStatus } from "@prisma/client";
import { useActionState } from "react";

import { respondToCustomerBudgetAction } from "@/app/portal/budgets/actions";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";

export function PortalBudgetResponseForm({
  budgetId,
  status,
}: {
  budgetId: string;
  status: BudgetStatus;
}) {
  const [state, formAction] = useActionState(
    respondToCustomerBudgetAction.bind(null, budgetId),
    initialActionState,
  );

  if (status !== BudgetStatus.SENT) {
    return null;
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-[color:var(--muted-strong)]"
          htmlFor="budgetResponseNote"
        >
          Comentario opcional
        </label>
        <Textarea
          id="budgetResponseNote"
          name="note"
          placeholder="Ej. Apruebo el presupuesto completo para continuar con el trabajo."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button name="nextStatus" type="submit" value={BudgetStatus.APPROVED}>
          Aprobar presupuesto
        </Button>
        <Button
          name="nextStatus"
          type="submit"
          value={BudgetStatus.REJECTED}
          variant="secondary"
        >
          Rechazar presupuesto
        </Button>
      </div>

      <FormMessage
        message={state.error ?? state.success}
        tone={state.success ? "success" : "error"}
      />
    </form>
  );
}
