import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session && session.user.role !== UserRole.CUSTOMER) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7faf9_0%,#f2f7f6_45%,#fbfcfd_100%)] px-4 py-8 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,79,82,0.12),_transparent_68%)]" />
      <div className="pointer-events-none absolute -left-16 top-16 h-52 w-52 rounded-full bg-[rgba(200,92,42,0.08)] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-64 w-64 rounded-full bg-[rgba(14,79,82,0.09)] blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1180px] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[32px] border-[rgba(14,79,82,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,247,246,0.96))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Acceso al sistema
          </p>
          <h1 className="mt-4 max-w-[12ch] font-heading text-4xl font-semibold leading-tight text-[color:var(--foreground)] md:text-5xl">
            Panel operativo del taller
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted-strong)] md:text-base">
            Entra con tu cuenta interna para revisar recepciones, autoinspecciones y el contexto
            necesario antes de recibir el vehiculo en el taller.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Recepcion clara
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">
                Revisa rapidamente el motivo principal, los datos del cliente y la evidencia visual.
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Flujo ordenado
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">
                Mantiene al equipo alineado entre administracion, recepcion y mecanicos.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] border-[rgba(14,79,82,0.14)] bg-white/92 p-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Inicio de sesion
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
            Entra a MecaniaOS
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">
            Usa una cuenta interna para acceder al panel operativo del taller.
          </p>

          <div className="mt-8 rounded-[24px] border border-[rgba(14,79,82,0.14)] bg-[rgba(14,79,82,0.06)] p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Credenciales de prueba
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[20px] border border-[color:var(--border)] bg-white/90 px-4 py-3">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">Administrador</p>
                <p className="mt-1 text-sm text-[color:var(--muted-strong)]">admin@mecaniaos.local</p>
                <p className="mt-1 text-sm font-medium text-[color:var(--success)]">Admin1234!</p>
              </div>
              <div className="rounded-[20px] border border-[color:var(--border)] bg-white/90 px-4 py-3">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">Mecanico</p>
                <p className="mt-1 text-sm text-[color:var(--muted-strong)]">mecanico@mecaniaos.local</p>
                <p className="mt-1 text-sm font-medium text-[color:var(--success)]">Mechanic1234!</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
