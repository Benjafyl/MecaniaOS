import { UserRole, WorkOrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getDashboardSummary(input?: { actorId?: string; actorRole?: UserRole }) {
  const workOrderWhere: Prisma.WorkOrderWhereInput =
    input?.actorRole === UserRole.MECHANIC && input.actorId
      ? {
          assignedTechnicianId: input.actorId,
        }
      : {};

  const [clients, vehicles, activeOrders, awaitingApproval, readyForDelivery, latestOrders] =
    await Promise.all([
      prisma.client.count(),
      prisma.vehicle.count(),
      prisma.workOrder.count({
        where: {
          ...workOrderWhere,
          status: {
            in: [
              WorkOrderStatus.RECEIVED,
              WorkOrderStatus.IN_DIAGNOSIS,
              WorkOrderStatus.WAITING_APPROVAL,
              WorkOrderStatus.WAITING_PARTS,
              WorkOrderStatus.IN_REPAIR,
              WorkOrderStatus.IN_PAINT,
              WorkOrderStatus.READY_FOR_DELIVERY,
            ],
          },
        },
      }),
      prisma.workOrder.count({
        where: {
          ...workOrderWhere,
          status: WorkOrderStatus.WAITING_APPROVAL,
        },
      }),
      prisma.workOrder.count({
        where: {
          ...workOrderWhere,
          status: WorkOrderStatus.READY_FOR_DELIVERY,
        },
      }),
      prisma.workOrder.findMany({
        where: workOrderWhere,
        include: {
          client: true,
          vehicle: true,
        },
        orderBy: {
          intakeDate: "desc",
        },
        take: 5,
      }),
    ]);

  return {
    clients,
    vehicles,
    activeOrders,
    awaitingApproval,
    readyForDelivery,
    latestOrders,
  };
}
