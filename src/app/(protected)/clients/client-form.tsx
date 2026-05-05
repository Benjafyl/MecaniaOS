"use client";

import { useActionState } from "react";

import { createClientAction } from "@/app/(protected)/clients/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/form-state";

export function ClientForm() {
  const [state, formAction] = useActionState(createClientAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="fullName">
            Nombre completo
          </label>
          <Input id="fullName" name="fullName" placeholder="Nombre del cliente" />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[color:var(--muted-strong)]"
            htmlFor="localIdentifier"
          >
            RUT o identificador
          </label>
          <Input id="localIdentifier" name="localIdentifier" placeholder="Opcional" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="phone">
            Telefono
          </label>
          <Input id="phone" name="phone" placeholder="+56 9 ..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="email">
            Correo
          </label>
          <Input id="email" name="email" placeholder="cliente@correo.com" type="email" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="address">
          Direccion
        </label>
        <Textarea id="address" name="address" placeholder="Direccion opcional del cliente" />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-[color:var(--muted-strong)]"
          htmlFor="portalPassword"
        >
          Contrasena del portal
        </label>
        <Input
          id="portalPassword"
          name="portalPassword"
          placeholder="Opcional, minimo 8 caracteres"
          type="password"
        />
        <p className="text-xs text-[color:var(--muted)]">
          Si completas este campo, el cliente quedara con acceso habilitado al portal usando su
          correo.
        </p>
      </div>

      <FormMessage message={state.error} />

      <SubmitButton
        className="w-full sm:w-auto"
        label="Crear cliente"
        pendingLabel="Creando cliente..."
      />
    </form>
  );
}
