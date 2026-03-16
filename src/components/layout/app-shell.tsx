import type { ReactNode } from "react";

import { UserRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";

function roleLabel(role: UserRole) {
  if (role === UserRole.ADMIN) {
    return "Administrador";
  }

  if (role === UserRole.MECHANIC) {
    return "Mecanico";
  }

  return "Cliente";
}

type AppShellProps = {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  onLogout: () => Promise<void>;
};

export function AppShell({ children, user, onLogout }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
      <aside className="hidden w-[280px] shrink-0 rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,241,231,0.95))] p-5 shadow-[0_20px_45px_rgba(33,29,24,0.08)] lg:block">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">MecaniaOS</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold">Taller digital</h1>
          <p className="mt-3 text-sm text-white/80">
            Operacion, trazabilidad y seguimiento desde una sola consola.
          </p>
        </div>

        <div className="mt-6">
          <SidebarNav />
        </div>

        <div className="mt-6 rounded-[28px] border border-white/60 bg-white/80 p-4">
          <p className="font-heading text-lg font-semibold text-[color:var(--foreground)]">
            {user.name}
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{user.email}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
            {roleLabel(user.role)}
          </p>
          <form action={onLogout} className="mt-4">
            <Button className="w-full" type="submit" variant="secondary">
              Cerrar sesion
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col gap-5">
        <header className="flex flex-col gap-4 rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,250,240,0.96),rgba(237,242,241,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(33,29,24,0.05)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Taller en linea
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
              MecaniaOS MVP
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted-strong)]">
              Flujo base operativo para clientes, vehiculos, ordenes de trabajo y
              seguimiento tecnico.
            </p>
          </div>

          <div className="lg:hidden">
            <form action={onLogout}>
              <Button type="submit" variant="secondary">
                Salir
              </Button>
            </form>
          </div>
        </header>

        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
