import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentSession } from "@/modules/auth/auth.service";

export default async function HomePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  redirect(session.user.role === UserRole.CUSTOMER ? "/portal" : "/dashboard");
}
