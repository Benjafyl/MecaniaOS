"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { BudgetStatus, UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import { setFlashMessage } from "@/lib/flash";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  createInsuranceCaseByLiquidator,
  respondToInsuranceBudget,
} from "@/modules/insurance-cases/insurance-case.service";

export async function createInsuranceCaseAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.LIQUIDATOR]);
    const files = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);

    const insuranceCase = await createInsuranceCaseByLiquidator(
      {
        clientId: String(formData.get("clientId") ?? ""),
        vehicleId: String(formData.get("vehicleId") ?? ""),
        claimNumber: String(formData.get("claimNumber") ?? ""),
        policyNumber: String(formData.get("policyNumber") ?? ""),
        incidentDate: String(formData.get("incidentDate") ?? ""),
        incidentLocation: String(formData.get("incidentLocation") ?? ""),
        description: String(formData.get("description") ?? ""),
      },
      files,
      session.user.id,
    );

    revalidatePath("/liquidador");
    revalidatePath("/insurance-cases");
    await setFlashMessage({
      message: "Siniestro registrado correctamente.",
      tone: "success",
    });
    redirect(`/liquidador/cases/${insuranceCase.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}

export async function respondToInsuranceBudgetAction(
  budgetId: string,
  caseId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const nextStatus = String(formData.get("nextStatus") ?? "");

    if (nextStatus !== BudgetStatus.APPROVED && nextStatus !== BudgetStatus.REJECTED) {
      return {
        error: "La respuesta solicitada no es valida.",
      };
    }

    await respondToInsuranceBudget(budgetId, {
      nextStatus,
      note: String(formData.get("note") ?? ""),
    });

    revalidatePath("/liquidador");
    revalidatePath(`/liquidador/cases/${caseId}`);
    revalidatePath("/budgets");
    revalidatePath(`/budgets/${budgetId}`);
    const successMessage =
      nextStatus === BudgetStatus.APPROVED
        ? "Presupuesto aprobado correctamente."
        : "Presupuesto rechazado correctamente.";

    return {
      success: successMessage,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}
