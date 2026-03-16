import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { searchVehicle } from "@/modules/vehicles/vehicle.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const vehicle = await searchVehicle({
      vin: searchParams.get("vin") ?? undefined,
      plate: searchParams.get("plate") ?? undefined,
    });
    return apiResponse(vehicle);
  } catch (error) {
    return apiError(error);
  }
}
