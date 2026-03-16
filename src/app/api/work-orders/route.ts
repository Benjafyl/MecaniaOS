import { UserRole, WorkOrderStatus } from "@prisma/client";

import { apiError, apiResponse } from "@/lib/http";
import { requireApiUser } from "@/modules/auth/auth.service";
import { createWorkOrder, listWorkOrders } from "@/modules/work-orders/work-order.service";

export async function GET(request: Request) {
  try {
    await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const workOrders = await listWorkOrders({
      search: searchParams.get("q") ?? undefined,
      status:
        statusParam && statusParam in WorkOrderStatus
          ? (statusParam as WorkOrderStatus)
          : undefined,
    });
    return apiResponse(workOrders);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiUser([UserRole.ADMIN, UserRole.MECHANIC]);
    const body = await request.json();
    const workOrder = await createWorkOrder(body, session.user.id);
    return apiResponse(workOrder, 201);
  } catch (error) {
    return apiError(error);
  }
}
