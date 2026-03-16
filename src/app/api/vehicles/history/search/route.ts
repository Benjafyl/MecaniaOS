import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getHistoryByVin } from "@/modules/service-history/service-history.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get("vin");

    const history = await getHistoryByVin(vin ?? "");
    return apiResponse(history);
  } catch (error) {
    return apiError(error);
  }
}
