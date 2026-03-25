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
        <label className="text-sm font-medium text-[#5b3fa6]" htmlFor="email">
          Correo
        </label>
        <Input
          className="border-[#d8c5ff] bg-white/95 focus:border-[#7c3aed] focus:ring-[rgba(124,58,237,0.16)]"
          defaultValue="admin@mecaniaos.local"
          id="email"
          name="email"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#5b3fa6]" htmlFor="password">
          Contrasena
        </label>
        <Input
          className="border-[#d8c5ff] bg-white/95 focus:border-[#7c3aed] focus:ring-[rgba(124,58,237,0.16)]"
          defaultValue="Admin1234!"
          id="password"
          name="password"
          type="password"
        />
      </div>

      <FormMessage message={state.error} />

      <SubmitButton
        className="w-full bg-[#7c3aed] shadow-[0_16px_34px_rgba(124,58,237,0.26)] hover:bg-[#6d28d9] focus-visible:ring-[rgba(124,58,237,0.2)]"
        label="Entrar al taller"
        pendingLabel="Ingresando..."
      />
    </form>
  );
}
