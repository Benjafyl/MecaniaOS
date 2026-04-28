"use client";

import { useActionState } from "react";

import { registerStockEntryAction } from "@/app/(protected)/inventory/actions";
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

export function StockEntryForm({ repuestos }: { repuestos: InventoryOption[] }) {
  const [state, formAction] = useActionState(registerStockEntryAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="entry-repuesto">
          Repuesto
        </label>
        <Select id="entry-repuesto" name="repuestoId">
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
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="entry-quantity">
          Cantidad ingresada
        </label>
        <Input id="entry-quantity" min={1} name="quantity" type="number" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="entry-reason">
          Observacion
        </label>
        <Textarea id="entry-reason" name="reason" placeholder="Compra, reposicion o guia interna" />
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Registrar ingreso" pendingLabel="Actualizando stock..." />
    </form>
  );
}
