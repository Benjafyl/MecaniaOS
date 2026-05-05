import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentSession } from "@/modules/auth/auth.service";
import { logoutAction } from "@/app/(protected)/actions";
import { purgeExpiredTrash } from "@/modules/trash/trash.service";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await purgeExpiredTrash();
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === UserRole.CUSTOMER) {
    redirect("/portal");
  }

  return (
    <AppShell
      onLogout={logoutAction}
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    >
      {children}
    </AppShell>
  );
}
