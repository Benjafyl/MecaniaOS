"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  createWorkOrder,
  updateWorkOrderStatus,
} from "@/modules/work-orders/work-order.service";

export async function createWorkOrderAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser();

    await createWorkOrder(
      {
        clientId: String(formData.get("clientId") ?? ""),
        vehicleId: String(formData.get("vehicleId") ?? ""),
        reason: String(formData.get("reason") ?? ""),
        initialDiagnosis: String(formData.get("initialDiagnosis") ?? ""),
        status: String(formData.get("status") ?? ""),
        estimatedDate: String(formData.get("estimatedDate") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/work-orders");
  redirect("/work-orders");
}

export async function updateWorkOrderStatusAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orderId = String(formData.get("orderId") ?? "");

  try {
    const session = await requireApiUser();

    await updateWorkOrderStatus(
      orderId,
      {
        status: String(formData.get("status") ?? ""),
        note: String(formData.get("note") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${orderId}`);
  redirect(`/work-orders/${orderId}`);
}
