"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import { setFlashMessage } from "@/lib/flash";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  addWorkOrderEvidence,
  createWorkOrder,
  updateWorkOrderAssignment,
  updateWorkOrderStatus,
} from "@/modules/work-orders/work-order.service";
import { setWorkOrderPartUsage } from "@/modules/inventory/inventory.service";

export async function createWorkOrderAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await createWorkOrder(
      {
        clientId: String(formData.get("clientId") ?? ""),
        vehicleId: String(formData.get("vehicleId") ?? ""),
        assignedTechnicianId: String(formData.get("assignedTechnicianId") ?? ""),
        reason: String(formData.get("reason") ?? ""),
        initialDiagnosis: String(formData.get("initialDiagnosis") ?? ""),
        status: String(formData.get("status") ?? ""),
        estimatedDate: String(formData.get("estimatedDate") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/work-orders");
  await setFlashMessage({
    message: "Orden de trabajo creada correctamente.",
    tone: "success",
  });
  redirect("/work-orders");
}

export async function updateWorkOrderAssignmentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orderId = String(formData.get("orderId") ?? "");

  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await updateWorkOrderAssignment(
      orderId,
      {
        assignedTechnicianId: String(formData.get("assignedTechnicianId") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${orderId}`);
  revalidatePath("/liquidador");
  await setFlashMessage({
    message: "Responsable actualizado correctamente.",
    tone: "success",
  });
  redirect(`/work-orders/${orderId}`);
}

export async function updateWorkOrderStatusAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orderId = String(formData.get("orderId") ?? "");

  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await updateWorkOrderStatus(
      orderId,
      {
        status: String(formData.get("status") ?? ""),
        note: String(formData.get("note") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${orderId}`);
  revalidatePath("/liquidador");
  await setFlashMessage({
    message: "Estado de la orden actualizado correctamente.",
    tone: "success",
  });
  redirect(`/work-orders/${orderId}`);
}

export async function addWorkOrderEvidenceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orderId = String(formData.get("orderId") ?? "");
  const file = formData.get("file");

  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    if (!(file instanceof File)) {
      throw new Error("Debe adjuntar una imagen");
    }

    await addWorkOrderEvidence(
      orderId,
      {
        file,
        note: String(formData.get("note") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath(`/work-orders/${orderId}`);
  revalidatePath("/liquidador");
  await setFlashMessage({
    message: "Evidencia subida correctamente.",
    tone: "success",
  });
  redirect(`/work-orders/${orderId}`);
}

export async function setWorkOrderPartUsageAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const orderId = String(formData.get("orderId") ?? "");

  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await setWorkOrderPartUsage(
      orderId,
      {
        repuestoId: String(formData.get("repuestoId") ?? ""),
        quantity: String(formData.get("quantity") ?? ""),
      },
      session.user.id,
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/inventory");
  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${orderId}`);
  revalidatePath("/liquidador");
  await setFlashMessage({
    message: "Uso de repuesto actualizado correctamente.",
    tone: "success",
  });
  redirect(`/work-orders/${orderId}`);
}
