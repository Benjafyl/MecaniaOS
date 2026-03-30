import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentSession } from "@/modules/auth/auth.service";
import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session && session.user.role !== UserRole.CUSTOMER) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,79,82,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(200,92,42,0.10),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-[480px] rounded-[34px] border border-[rgba(15,23,42,0.08)] bg-[rgba(255,255,255,0.9)] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-semibold uppercase tracking-[0.18em] text-white">
              MO
            </div>
            <div>
              <p className="text-sm font-semibold text-[color:var(--foreground)]">MecaniaOS</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Acceso interno
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Inicio de sesion
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-4xl">
              Un login simple para entrar al taller
            </h1>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">
              Accede al panel operativo con una sola pantalla, sin bloques extra ni distracciones.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-[#f7f7f3] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Credenciales de prueba
              </p>
              <span className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-2.5 py-1 text-[11px] font-medium text-[color:var(--muted-strong)]">
                Demo
              </span>
            </div>

            <div className="mt-4 divide-y divide-[rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">Administrador</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">admin@mecaniaos.local</p>
                </div>
                <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f766e]">
                  Admin1234!
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 py-3 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">Mecanico</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">mecanico@mecaniaos.local</p>
                </div>
                <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f766e]">
                  Mechanic1234!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[rgba(15,23,42,0.08)] pt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
