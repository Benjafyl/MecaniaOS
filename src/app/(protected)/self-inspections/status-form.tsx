"use client";

import { useActionState } from "react";

import { updateSelfInspectionStatusAction } from "@/app/(protected)/self-inspections/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";
import { SELF_INSPECTION_STATUS_OPTIONS } from "@/modules/self-inspections/self-inspection.constants";

export function SelfInspectionStatusForm({
  inspectionId,
  currentStatus,
}: {
  inspectionId: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(
    updateSelfInspectionStatusAction.bind(null, inspectionId),
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="status">
          Nuevo estado
        </label>
        <Select defaultValue={currentStatus} id="status" name="status">
          {SELF_INSPECTION_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="note">
          Motivo
        </label>
        <Input id="note" name="note" placeholder="Opcional" />
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Actualizar estado" pendingLabel="Actualizando..." />
    </form>
  );
}
