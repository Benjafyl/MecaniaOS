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
          className="bg-white/95"
          defaultValue="admin@mecaniaos.local"
          id="email"
          name="email"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="password">
          Contrasena
        </label>
        <Input
          className="bg-white/95"
          defaultValue="Admin1234!"
          id="password"
          name="password"
          type="password"
        />
      </div>

      <FormMessage message={state.error} />

      <SubmitButton
        className="w-full"
        label="Entrar al taller"
        pendingLabel="Ingresando..."
      />
    </form>
  );
}
