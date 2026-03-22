"use client";

import { useActionState } from "react";

import { updateWorkOrderAssignmentAction } from "@/app/(protected)/work-orders/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

type AssignmentFormProps = {
  orderId: string;
  currentAssignedTechnicianId?: string | null;
  mechanics: Array<{
    id: string;
    name: string;
  }>;
};

export function AssignmentForm({
  orderId,
  currentAssignedTechnicianId,
  mechanics,
}: AssignmentFormProps) {
  const [state, formAction] = useActionState(updateWorkOrderAssignmentAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="orderId" type="hidden" value={orderId} />
      <Select defaultValue={currentAssignedTechnicianId ?? ""} name="assignedTechnicianId">
        <option value="">Sin asignar</option>
        {mechanics.map((mechanic) => (
          <option key={mechanic.id} value={mechanic.id}>
            {mechanic.name}
          </option>
        ))}
      </Select>
      <FormMessage message={state.error} />
      <SubmitButton label="Guardar asignacion" pendingLabel="Guardando..." />
    </form>
  );
}
