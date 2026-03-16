"use client";

import { useActionState } from "react";
import { WorkOrderStatus } from "@prisma/client";

import { updateWorkOrderStatusAction } from "@/app/(protected)/work-orders/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";
import { WORK_ORDER_STATUS_OPTIONS } from "@/modules/work-orders/work-order.constants";

type StatusFormProps = {
  orderId: string;
  currentStatus: WorkOrderStatus;
};

export function StatusForm({ orderId, currentStatus }: StatusFormProps) {
  const [state, formAction] = useActionState(updateWorkOrderStatusAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="orderId" type="hidden" value={orderId} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="status">
          Nuevo estado
        </label>
        <Select defaultValue={currentStatus} id="status" name="status">
          {WORK_ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="note">
          Nota del cambio
        </label>
        <Textarea id="note" name="note" placeholder="Observacion opcional del avance" />
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Actualizar estado" pendingLabel="Actualizando..." />
    </form>
  );
}
