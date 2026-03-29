"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { UserRole } from "@prisma/client";

import { getErrorMessage } from "@/lib/errors";
import type { ActionState } from "@/lib/form-state";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  createSelfInspectionInvite,
  reviewSelfInspection,
  updateSelfInspectionStatus,
} from "@/modules/self-inspections/self-inspection.service";

export type InviteActionState = ActionState;

export async function createSelfInspectionInviteAction(
  _previousState: InviteActionState,
  formData: FormData,
): Promise<InviteActionState> {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    const invite = await createSelfInspectionInvite({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      sourceChannel: String(formData.get("sourceChannel") ?? "SECURE_LINK"),
      expiresInDays: String(formData.get("expiresInDays") ?? "7"),
    });

    revalidatePath("/self-inspections");
    redirect(`/self-inspections/${invite.inspectionId}?token=${invite.token}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error: getErrorMessage(error),
    };
  }
}

export async function reviewSelfInspectionAction(
  inspectionId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await reviewSelfInspection(
      inspectionId,
      {
        riskAssessment: String(formData.get("riskAssessment") ?? ""),
        internalSummary: String(formData.get("internalSummary") ?? ""),
        recommendedNextStep: String(formData.get("recommendedNextStep") ?? ""),
        departmentSuggestion: String(formData.get("departmentSuggestion") ?? ""),
        createWorkOrderSuggestion: formData.get("createWorkOrderSuggestion") === "on",
        createQuoteSuggestion: formData.get("createQuoteSuggestion") === "on",
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

  revalidatePath(`/self-inspections/${inspectionId}`);
  redirect(`/self-inspections/${inspectionId}`);
}

export async function updateSelfInspectionStatusAction(
  inspectionId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);

    await updateSelfInspectionStatus(
      inspectionId,
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

  revalidatePath(`/self-inspections/${inspectionId}`);
  redirect(`/self-inspections/${inspectionId}`);
}
