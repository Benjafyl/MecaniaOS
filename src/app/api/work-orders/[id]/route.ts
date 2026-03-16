import { UserRole } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { getWorkOrderById, updateWorkOrder } from "@/modules/work-orders/work-order.service";

type WorkOrderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: WorkOrderRouteContext) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const workOrder = await getWorkOrderById(id);
    return apiResponse(workOrder);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: WorkOrderRouteContext) {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { id } = await context.params;
    const body = await request.json();
    const workOrder = await updateWorkOrder(id, body, session.user.id);
    return apiResponse(workOrder);
  } catch (error) {
    return apiError(error);
  }
}
