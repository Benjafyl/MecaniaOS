"use server";

import { redirect } from "next/navigation";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { signIn } from "@/modules/auth/auth.service";

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await signIn({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  redirect("/dashboard");
}
