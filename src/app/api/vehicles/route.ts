import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { createVehicle, listVehicles } from "@/modules/vehicles/vehicle.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const vehicles = await listVehicles(searchParams.get("q") ?? undefined);
    return apiResponse(vehicles);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const body = await request.json();
    const vehicle = await createVehicle(body);
    return apiResponse(vehicle, 201);
  } catch (error) {
    return apiError(error);
  }
}
