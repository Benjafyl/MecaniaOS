import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-[1400px] gap-6 px-4 py-6 md:grid-cols-[1.1fr_0.9fr] md:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--border)] bg-[linear-gradient(150deg,#1e1a15_0%,#2f2821_48%,#0f4e4f_100%)] p-8 text-white shadow-[0_24px_60px_rgba(22,18,15,0.18)] md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,92,42,0.32),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_28%)]" />
        <div className="relative z-10 max-w-xl">
          <Badge className="bg-white/12 text-white" tone="neutral">
            MVP Taller
          </Badge>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight md:text-6xl">
            Seguimiento mecanico con trazabilidad real.
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/74 md:text-lg">
            Registro de clientes, vehiculos, ordenes y estados de reparacion en una sola
            plataforma operativa.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Sprint 1</p>
              <p className="mt-3 text-xl font-semibold">Flujo base listo</p>
              <p className="mt-2 text-sm text-white/68">
                Auth, clientes, vehiculos, ordenes, estados e historial tecnico.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Stack</p>
              <p className="mt-3 text-xl font-semibold">Next + Prisma + PostgreSQL</p>
              <p className="mt-2 text-sm text-white/68">
                Arquitectura modular preparada para inventario y cotizaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center">
        <Card className="w-full rounded-[36px] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Ingreso interno
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
            Acceso al panel
          </h2>
          <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
            Usa el usuario administrador de seed para probar el MVP desde el primer arranque.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </section>
    </div>
  );
}
