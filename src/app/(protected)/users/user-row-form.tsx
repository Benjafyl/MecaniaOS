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
          <option value={UserRole.LIQUIDATOR}>Liquidador</option>
        </Select>
        <Input name="password" placeholder="Nueva contrasena opcional" type="password" />
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted-strong)]">
          <input defaultChecked={user.active} name="active" type="checkbox" />
          Activo
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FormMessage className="sm:max-w-xl" message={state.error} />
        <SubmitButton
          className="w-full sm:w-auto"
          label="Guardar cambios"
          pendingLabel="Guardando..."
        />
      </div>
    </form>
  );
}
