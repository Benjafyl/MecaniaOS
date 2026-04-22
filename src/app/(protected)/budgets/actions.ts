"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  createWorkOrderFromBudget,
  createBudgetDraft,
  transitionBudgetStatus,
  updateBudgetDraft,
} from "@/modules/budgets/budget.service";

function parseReferenceSelections(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => key.startsWith("referenceQty:"))
    .map(([key, value]) => ({
      referenceCatalogId: key.replace("referenceQty:", ""),
      quantity: Number(value),
    }))
    .filter((entry) => Number.isFinite(entry.quantity) && entry.quantity > 0);
}

function parseLineUpdates(formData: FormData) {
  const grouped = new Map<
    string,
    {
      quantity?: number;
      unitPrice?: number;
      note?: string;
    }
  >();

  for (const [key, rawValue] of formData.entries()) {
    const value = String(rawValue);

    if (key.startsWith("lineQty:")) {
      const id = key.replace("lineQty:", "");
      grouped.set(id, {
        ...grouped.get(id),
        quantity: Number(value),
      });
    }

    if (key.startsWith("linePrice:")) {
      const id = key.replace("linePrice:", "");
      grouped.set(id, {
        ...grouped.get(id),
        unitPrice: Number(value),
      });
    }

    if (key.startsWith("lineNote:")) {
      const id = key.replace("lineNote:", "");
      grouped.set(id, {
        ...grouped.get(id),
        note: value,
      });
    }
  }

  return Array.from(grouped.entries()).map(([id, entry]) => ({
    id,
    quantity: entry.quantity ?? 1,
    unitPrice: entry.unitPrice ?? 0,
    note: entry.note,
  }));
}

export async function createBudgetDraftAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    const budget = await createBudgetDraft(
      {
        clientId: String(formData.get("clientId") ?? ""),
        vehicleId: String(formData.get("vehicleId") ?? ""),
        title: String(formData.get("title") ?? ""),
        summary: String(formData.get("summary") ?? ""),
      },
      parseReferenceSelections(formData),
      session.user.id,
    );

    revalidatePath("/budgets");
    redirect(`/budgets/${budget.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}

export async function updateBudgetDraftAction(
  budgetId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await updateBudgetDraft(
      budgetId,
      {
        title: String(formData.get("title") ?? ""),
        summary: String(formData.get("summary") ?? ""),
      },
      parseLineUpdates(formData),
      session.user.id,
    );

    revalidatePath("/budgets");
    revalidatePath(`/budgets/${budgetId}`);
    return {};
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}

export async function transitionBudgetStatusAction(
  budgetId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await transitionBudgetStatus(
      budgetId,
      {
        nextStatus: String(formData.get("nextStatus") ?? ""),
        note: String(formData.get("note") ?? ""),
      },
      session.user.id,
    );

    revalidatePath("/budgets");
    revalidatePath(`/budgets/${budgetId}`);
    return {};
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}

export async function createWorkOrderFromBudgetAction(
  budgetId: string,
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    void previousState;
    void formData;
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const workOrder = await createWorkOrderFromBudget(budgetId, session.user.id);

    revalidatePath("/budgets");
    revalidatePath(`/budgets/${budgetId}`);
    revalidatePath("/work-orders");
    revalidatePath(`/work-orders/${workOrder.id}`);
    redirect(`/work-orders/${workOrder.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}
