"use client";

import { useActionState } from "react";
import { UserRole } from "@prisma/client";

import { createInternalUserAction } from "@/app/(protected)/users/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

export function UserForm() {
  const [state, formAction] = useActionState(createInternalUserAction, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="name">
            Nombre
          </label>
          <Input id="name" name="name" placeholder="Nombre del usuario" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="email">
            Correo
          </label>
          <Input id="email" name="email" placeholder="usuario@correo.com" type="email" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="password">
            Contrasena inicial
          </label>
          <Input id="password" name="password" placeholder="Minimo 8 caracteres" type="password" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--muted-strong)]" htmlFor="role">
            Rol
          </label>
          <Select defaultValue={UserRole.MECHANIC} id="role" name="role">
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.MECHANIC}>Mecanico</option>
          </Select>
        </div>
      </div>

      <FormMessage message={state.error} />
      <SubmitButton label="Crear usuario interno" pendingLabel="Creando usuario..." />
    </form>
  );
}
