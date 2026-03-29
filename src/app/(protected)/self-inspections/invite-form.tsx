"use client";

import { useActionState } from "react";

import { createSelfInspectionInviteAction } from "@/app/(protected)/self-inspections/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";
import { SELF_INSPECTION_SOURCE_LABELS } from "@/modules/self-inspections/self-inspection.constants";

export function InviteForm() {
  const [state, formAction] = useActionState(createSelfInspectionInviteAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="fullName">
            Nombre del cliente
          </label>
          <Input id="fullName" name="fullName" placeholder="Ej: Juan Perez" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="phone">
            Telefono
          </label>
          <Input id="phone" name="phone" placeholder="+56 9 1234 5678" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="email">
          Correo del cliente
        </label>
        <Input id="email" name="email" placeholder="cliente@correo.com" type="email" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="sourceChannel">
            Canal de origen
          </label>
          <Select defaultValue="SECURE_LINK" id="sourceChannel" name="sourceChannel">
            {Object.entries(SELF_INSPECTION_SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="expiresInDays">
            Expira en dias
          </label>
          <Input defaultValue="7" id="expiresInDays" min="1" name="expiresInDays" type="number" />
        </div>
      </div>

      <div className="rounded-[20px] border border-[rgba(14,79,82,0.14)] bg-[rgba(14,79,82,0.06)] px-4 py-3 text-sm text-[color:var(--muted-strong)]">
        Si el correo ya existe, reutilizamos ese cliente. Si no existe, se crea automaticamente
        para que no dependas de tu base de datos antes de generar el enlace.
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Generar enlace seguro" pendingLabel="Generando enlace..." />
    </form>
  );
}
