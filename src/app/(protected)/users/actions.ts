"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import { createInternalUser, updateInternalUser } from "@/modules/users/user.service";

export async function createInternalUserAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireApiUser([UserRole.ADMIN]);

    await createInternalUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? ""),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateInternalUserAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = String(formData.get("userId") ?? "");

  try {
    await requireApiUser([UserRole.ADMIN]);

    await updateInternalUser(userId, {
      role: String(formData.get("role") ?? ""),
      active: formData.get("active") === "on",
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/users");
  redirect("/users");
}
