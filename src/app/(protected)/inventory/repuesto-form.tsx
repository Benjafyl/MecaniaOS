"use client";

import { useActionState } from "react";

import { createRepuestoAction } from "@/app/(protected)/inventory/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

export function RepuestoForm() {
  const [state, formAction] = useActionState(createRepuestoAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="name">
            Nombre
          </label>
          <Input id="name" name="name" placeholder="Pastillas de freno delanteras" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="code">
            Codigo o referencia
          </label>
          <Input id="code" name="code" placeholder="PF-DEL-001" />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[color:var(--muted-strong)]"
            htmlFor="initialStock"
          >
            Stock inicial
          </label>
          <Input defaultValue={0} id="initialStock" min={0} name="initialStock" type="number" />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[color:var(--muted-strong)]"
            htmlFor="minimumStock"
          >
            Stock minimo
          </label>
          <Input defaultValue={0} id="minimumStock" min={0} name="minimumStock" type="number" />
        </div>
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Crear repuesto" pendingLabel="Creando repuesto..." />
    </form>
  );
}
