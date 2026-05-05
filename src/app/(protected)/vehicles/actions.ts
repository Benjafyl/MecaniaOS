"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getErrorMessage } from "@/lib/errors";
import { setFlashMessage } from "@/lib/flash";
import type { ActionState } from "@/lib/form-state";
import { createVehicle } from "@/modules/vehicles/vehicle.service";
import { requireApiUser } from "@/modules/auth/auth.service";

export async function createVehicleAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireApiUser();

    await createVehicle({
      clientId: String(formData.get("clientId") ?? ""),
      plate: String(formData.get("plate") ?? ""),
      vin: String(formData.get("vin") ?? ""),
      make: String(formData.get("make") ?? ""),
      model: String(formData.get("model") ?? ""),
      year: String(formData.get("year") ?? ""),
      color: String(formData.get("color") ?? ""),
      mileage: String(formData.get("mileage") ?? ""),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/vehicles");
  await setFlashMessage({
    message: "Vehiculo creado correctamente.",
    tone: "success",
  });
  redirect("/vehicles");
}
