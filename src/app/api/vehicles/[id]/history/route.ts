import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getHistoryByVehicleId } from "@/modules/service-history/service-history.service";

type VehicleHistoryContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: VehicleHistoryContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const history = await getHistoryByVehicleId(id);
    return apiResponse(history);
  } catch (error) {
    return apiError(error);
  }
}
