"use server";

import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { signIn } from "@/modules/auth/auth.service";

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let destination = "/dashboard";

  try {
    const user = await signIn({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    destination = user.role === UserRole.CUSTOMER ? "/portal" : "/dashboard";
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  redirect(destination);
}
