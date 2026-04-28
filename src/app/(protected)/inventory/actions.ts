"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  adjustStock,
  createRepuesto,
  registerStockEntry,
} from "@/modules/inventory/inventory.service";

export async function createRepuestoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN]);

    await createRepuesto(
      {
        name: String(formData.get("name") ?? ""),
        code: String(formData.get("code") ?? ""),
        unitPrice: String(formData.get("unitPrice") ?? ""),
        initialStock: String(formData.get("initialStock") ?? ""),
        minimumStock: String(formData.get("minimumStock") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function registerStockEntryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN]);

    await registerStockEntry(
      {
        repuestoId: String(formData.get("repuestoId") ?? ""),
        quantity: String(formData.get("quantity") ?? ""),
        reason: String(formData.get("reason") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function adjustStockAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN]);

    await adjustStock(
      {
        repuestoId: String(formData.get("repuestoId") ?? ""),
        quantity: String(formData.get("quantity") ?? ""),
        reason: String(formData.get("reason") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}
