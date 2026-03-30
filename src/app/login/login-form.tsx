"use client";

import { useActionState } from "react";

import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";
import { loginAction } from "@/app/login/actions";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="email">
          Correo
        </label>
        <Input
          autoComplete="email"
          className="min-h-12 rounded-2xl border-[rgba(15,23,42,0.08)] bg-[#f7f7f3] px-4 shadow-none focus:border-[#0f766e] focus:ring-[rgba(15,118,110,0.12)]"
          defaultValue="admin@mecaniaos.local"
          id="email"
          name="email"
          placeholder="correo@empresa.com"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="password">
          Contrasena
        </label>
        <Input
          autoComplete="current-password"
          className="min-h-12 rounded-2xl border-[rgba(15,23,42,0.08)] bg-[#f7f7f3] px-4 shadow-none focus:border-[#0f766e] focus:ring-[rgba(15,118,110,0.12)]"
          defaultValue="Admin1234!"
          id="password"
          name="password"
          placeholder="Tu contrasena"
          type="password"
        />
      </div>

      <FormMessage className="rounded-2xl" message={state.error} />

      <SubmitButton
        className="min-h-12 w-full rounded-2xl bg-[#0f172a] shadow-[0_18px_36px_rgba(15,23,42,0.18)] hover:bg-[#111827]"
        label="Entrar"
        pendingLabel="Ingresando..."
      />

      <p className="text-xs leading-5 text-[color:var(--muted)]">
        Usa una cuenta interna para acceder a recepcion, ordenes de trabajo y seguimiento del taller.
      </p>
    </form>
  );
}
