import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  createSelfInspectionInvite,
  listSelfInspections,
} from "@/modules/self-inspections/self-inspection.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const inspections = await listSelfInspections({
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      risk: searchParams.get("risk") ?? undefined,
    });

    return apiResponse(inspections);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const body = await request.json();
    const invite = await createSelfInspectionInvite(body);

    return apiResponse(invite, 201);
  } catch (error) {
    return apiError(error);
  }
}
