import { redirect } from "next/navigation";

import { getCurrentSession } from "@/modules/auth/auth.service";

export default async function HomePage() {
  const session = await getCurrentSession();

  redirect(session ? "/dashboard" : "/login");
}
