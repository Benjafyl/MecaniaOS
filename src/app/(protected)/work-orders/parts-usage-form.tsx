"use client";

import { useActionState } from "react";

import { setWorkOrderPartUsageAction } from "@/app/(protected)/work-orders/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

type InventoryOption = {
  id: string;
  name: string;
  code: string;
  currentStock: number;
};

type PartsUsageFormProps = {
  orderId: string;
  repuestos: InventoryOption[];
};

export function PartsUsageForm({ orderId, repuestos }: PartsUsageFormProps) {
  const [state, formAction] = useActionState(setWorkOrderPartUsageAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <input name="orderId" type="hidden" value={orderId} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="part-repuesto">
          Repuesto
        </label>
        <Select id="part-repuesto" name="repuestoId">
          <option value="">Selecciona un repuesto</option>
          {repuestos.map((repuesto) => (
            <option key={repuesto.id} value={repuesto.id}>
              {repuesto.name} / {repuesto.code} / stock {repuesto.currentStock}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="part-quantity">
          Cantidad final usada
        </label>
        <Input id="part-quantity" min={0} name="quantity" type="number" />
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Actualizar consumo" pendingLabel="Actualizando consumo..." />
    </form>
  );
}

type ExistingPartUsageFormProps = {
  orderId: string;
  part: {
    repuestoId: string;
    quantity: number;
  };
};

export function ExistingPartUsageForm({ orderId, part }: ExistingPartUsageFormProps) {
  const [state, formAction] = useActionState(setWorkOrderPartUsageAction, initialActionState);

  return (
    <form action={formAction} className="space-y-3">
      <input name="orderId" type="hidden" value={orderId} />
      <input name="repuestoId" type="hidden" value={part.repuestoId} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input defaultValue={part.quantity} min={0} name="quantity" type="number" />
        <SubmitButton
          className="sm:w-44"
          label="Guardar"
          pendingLabel="Guardando..."
          variant="secondary"
        />
      </div>

      <FormMessage message={state.error} />
    </form>
  );
}
