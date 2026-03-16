import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getVehicleById, updateVehicle } from "@/modules/vehicles/vehicle.service";

type VehicleRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: VehicleRouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const vehicle = await getVehicleById(id);
    return apiResponse(vehicle);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: VehicleRouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const body = await request.json();
    const vehicle = await updateVehicle(id, body);
    return apiResponse(vehicle);
  } catch (error) {
    return apiError(error);
  }
}
