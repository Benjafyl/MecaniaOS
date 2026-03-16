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
    <div className="mx-auto flex min-h-screen max-w-[1320px] items-center justify-center px-4 py-8 md:px-8 lg:px-10">
      <Card className="w-full max-w-[520px] border-[color:var(--border-strong)] bg-white/[0.94] p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[#5f7fa8]">
          Acceso al sistema
        </p>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted-strong)]">
          Usa una cuenta interna para entrar al panel operativo del taller.
        </p>

        <div className="mt-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#5f7fa8]">
            Credenciales de prueba
          </p>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted-strong)]">
            <div className="rounded-lg border border-[color:var(--border)] bg-white px-4 py-3">
              <p className="font-semibold text-[color:var(--foreground)]">Administrador</p>
              <p className="mt-1">admin@mecaniaos.local</p>
              <p className="mt-1 font-medium text-[#2563eb]">Admin1234!</p>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-white px-4 py-3">
              <p className="font-semibold text-[color:var(--foreground)]">Mecanico</p>
              <p className="mt-1">mecanico@mecaniaos.local</p>
              <p className="mt-1 font-medium text-[#2563eb]">Mechanic1234!</p>
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
