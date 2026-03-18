import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getSelfInspectionById } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await params;
    const inspection = await getSelfInspectionById(id);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
