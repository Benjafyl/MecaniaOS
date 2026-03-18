import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { reviewSelfInspection } from "@/modules/self-inspections/self-inspection.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await params;
    const body = await request.json();
    const inspection = await reviewSelfInspection(id, body, session.user.id);

    return apiResponse(inspection);
  } catch (error) {
    return apiError(error);
  }
}
