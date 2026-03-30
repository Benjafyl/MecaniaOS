"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { createClient } from "@/modules/clients/client.service";
import { requireApiUser } from "@/modules/auth/auth.service";

export async function createClientAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireApiUser();

    await createClient({
      fullName: String(formData.get("fullName") ?? ""),
      localIdentifier: String(formData.get("localIdentifier") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      address: String(formData.get("address") ?? ""),
      portalPassword: String(formData.get("portalPassword") ?? ""),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/clients");
  redirect("/clients");
}
