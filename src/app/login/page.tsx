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
    <div className="relative mx-auto flex min-h-screen max-w-[1320px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_34%),linear-gradient(180deg,_#f8f4ff_0%,_#f5efff_42%,_#fdfbff_100%)] px-4 py-8 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(126,34,206,0.24),_transparent_68%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-[rgba(192,132,252,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-56 w-56 rounded-full bg-[rgba(147,51,234,0.14)] blur-3xl" />

      <Card className="relative z-10 w-full max-w-[520px] border-[#d7c3ff] bg-white/90 p-8 shadow-[0_28px_80px_rgba(91,33,182,0.16)] md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[#7c3aed]">
          Acceso al sistema
        </p>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-[#3b1d74]">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6b4ea2]">
          Usa una cuenta interna para entrar al panel operativo del taller.
        </p>

        <div className="mt-8 rounded-xl border border-[#e2d4ff] bg-[linear-gradient(180deg,_rgba(250,245,255,0.96)_0%,_rgba(245,240,255,0.9)_100%)] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#8b5cf6]">
            Credenciales de prueba
          </p>
          <div className="mt-4 space-y-3 text-sm text-[#6b4ea2]">
            <div className="rounded-lg border border-[#e6dcff] bg-white/95 px-4 py-3">
              <p className="font-semibold text-[#3b1d74]">Administrador</p>
              <p className="mt-1">admin@mecaniaos.local</p>
              <p className="mt-1 font-medium text-[#7c3aed]">Admin1234!</p>
            </div>
            <div className="rounded-lg border border-[#e6dcff] bg-white/95 px-4 py-3">
              <p className="font-semibold text-[#3b1d74]">Mecanico</p>
              <p className="mt-1">mecanico@mecaniaos.local</p>
              <p className="mt-1 font-medium text-[#7c3aed]">Mechanic1234!</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
