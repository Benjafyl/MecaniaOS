"use client";

import { useActionState } from "react";

import { adjustStockAction } from "@/app/(protected)/inventory/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";

type InventoryOption = {
  id: string;
  name: string;
  code: string;
  unitPrice: number;
  currentStock: number;
};

export function StockAdjustmentForm({ repuestos }: { repuestos: InventoryOption[] }) {
  const [state, formAction] = useActionState(adjustStockAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="adjust-repuesto">
          Repuesto
        </label>
        <Select id="adjust-repuesto" name="repuestoId">
          <option value="">Selecciona un repuesto</option>
          {repuestos.map((repuesto) => (
            <option key={repuesto.id} value={repuesto.id}>
              {repuesto.name} / {repuesto.code} / {repuesto.unitPrice.toLocaleString("es-CL")} CLP / stock{" "}
              {repuesto.currentStock}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="adjust-quantity">
          Ajuste
        </label>
        <Input id="adjust-quantity" name="quantity" placeholder="-1 o 3" type="number" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="adjust-reason">
          Motivo
        </label>
        <Textarea id="adjust-reason" name="reason" placeholder="Diferencia por conteo fisico, merma o correccion" />
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Ajustar stock" pendingLabel="Registrando ajuste..." />
    </form>
  );
}
