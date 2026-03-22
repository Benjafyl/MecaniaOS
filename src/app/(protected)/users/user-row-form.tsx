"use client";

import { useActionState } from "react";
import { UserRole } from "@prisma/client";

import { updateInternalUserAction } from "@/app/(protected)/users/actions";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialActionState } from "@/lib/form-state";

type UserRowFormProps = {
  user: {
    id: string;
    role: UserRole;
    active: boolean;
  };
};

export function UserRowForm({ user }: UserRowFormProps) {
  const [state, formAction] = useActionState(updateInternalUserAction, initialActionState);

  return (
    <form action={formAction} className="space-y-3">
      <input name="userId" type="hidden" value={user.id} />
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Select defaultValue={user.role} name="role">
          <option value={UserRole.ADMIN}>Administrador</option>
          <option value={UserRole.MECHANIC}>Mecanico</option>
        </Select>
        <Input name="password" placeholder="Nueva contrasena opcional" type="password" />
        <label className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted-strong)]">
          <input defaultChecked={user.active} name="active" type="checkbox" />
          Activo
        </label>
      </div>
      <FormMessage message={state.error} />
      <SubmitButton label="Guardar cambios" pendingLabel="Guardando..." />
    </form>
  );
}
