"use client";

import { useActionState } from "react";

import { createSelfInspectionInviteAction } from "@/app/(protected)/self-inspections/actions";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

export function InviteForm() {
  const [state, formAction] = useActionState(createSelfInspectionInviteAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="rounded-[20px] border border-[rgba(14,79,82,0.14)] bg-[rgba(14,79,82,0.06)] px-4 py-3 text-sm text-[color:var(--muted-strong)]">
        Genera un enlace listo para compartir. Desde el detalle podras abrirlo, copiarlo y mostrar
        el QR del flujo de autoinspeccion.
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Generar enlace seguro" pendingLabel="Generando enlace..." />
    </form>
  );
}
