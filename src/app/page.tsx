import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentSession } from "@/modules/auth/auth.service";

export default async function HomePage() {
  const session = await getCurrentSession();

  redirect(session && session.user.role !== UserRole.CUSTOMER ? "/dashboard" : "/login");
}
