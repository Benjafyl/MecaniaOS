import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { UserForm } from "@/app/(protected)/users/user-form";
import { UserRowForm } from "@/app/(protected)/users/user-row-form";
import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { getInternalRoleLabel, listInternalUsers } from "@/modules/users/user.service";

export default async function UsersPage() {
  const session = await getCurrentSession();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const users = await listInternalUsers();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
            Control de acceso
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">Usuarios internos</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
            Crea usuarios del taller y ajusta su rol o estado sin salir del panel.
          </p>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-2xl">
          <h2 className="font-heading text-2xl font-semibold">Nuevo usuario</h2>
          <div className="mt-5">
            <UserForm />
          </div>
        </Card>

        <div className="space-y-4">
          {users.map((user) => (
            <Card className="rounded-2xl" key={user.id}>
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{user.name}</h2>
                  <p className="mt-2 text-sm text-[color:var(--muted-strong)]">{user.email}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {getInternalRoleLabel(user.role)} / {user.active ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <UserRowForm user={user} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
