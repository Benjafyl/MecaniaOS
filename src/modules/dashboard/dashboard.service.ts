import { WorkOrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getDashboardSummary() {
  const [clients, vehicles, activeOrders, awaitingApproval, readyForDelivery, latestOrders] =
    await Promise.all([
      prisma.client.count(),
      prisma.vehicle.count(),
      prisma.workOrder.count({
        where: {
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
          status: WorkOrderStatus.WAITING_APPROVAL,
        },
      }),
      prisma.workOrder.count({
        where: {
          status: WorkOrderStatus.READY_FOR_DELIVERY,
        },
      }),
      prisma.workOrder.findMany({
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
