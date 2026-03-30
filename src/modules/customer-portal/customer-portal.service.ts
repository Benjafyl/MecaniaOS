import { NotFoundError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { requireCustomerUser } from "@/modules/auth/auth.service";
import { WorkOrderStatus } from "@prisma/client";
import {
  getWorkOrderProgressPercent,
  isClosedStatus,
} from "@/modules/work-orders/work-order.constants";

function getCurrentOrLatestWorkOrder<T extends { status: Parameters<typeof isClosedStatus>[0] }>(
  workOrders: T[],
) {
  return workOrders.find((workOrder) => !isClosedStatus(workOrder.status)) ?? workOrders[0] ?? null;
}

export async function getCustomerPortalOverview() {
  const session = await requireCustomerUser();

  if (!session.user.clientId) {
    return {
      customer: null,
      vehicles: [],
      stats: {
        vehicles: 0,
        openOrders: 0,
        readyForDelivery: 0,
      },
    };
  }

  const customer = await prisma.client.findUnique({
    where: {
      id: session.user.clientId,
    },
    include: {
      vehicles: {
        include: {
          workOrders: {
            include: {
              statusLogs: {
                orderBy: {
                  changedAt: "desc",
                },
                take: 1,
              },
            },
            orderBy: {
              intakeDate: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    throw new NotFoundError("Cliente no encontrado");
  }

  const vehicles = customer.vehicles.map((vehicle) => {
    const currentOrder = getCurrentOrLatestWorkOrder(vehicle.workOrders);

    return {
      ...vehicle,
      currentOrder,
      progressPercent: currentOrder ? getWorkOrderProgressPercent(currentOrder.status) : 0,
    };
  });

  const openOrders = vehicles.filter(
    (vehicle) => vehicle.currentOrder && !isClosedStatus(vehicle.currentOrder.status),
  ).length;
  const readyForDelivery = vehicles.filter(
    (vehicle) => vehicle.currentOrder?.status === WorkOrderStatus.READY_FOR_DELIVERY,
  ).length;

  return {
    customer,
    vehicles,
    stats: {
      vehicles: vehicles.length,
      openOrders,
      readyForDelivery,
    },
  };
}

export async function getCustomerPortalVehicleDetail(vehicleId: string) {
  const session = await requireCustomerUser();

  if (!session.user.clientId) {
    throw new UnauthorizedError("Tu acceso al portal aun no esta habilitado");
  }

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      clientId: session.user.clientId,
    },
    include: {
      client: true,
      workOrders: {
        include: {
          evidences: {
            include: {
              uploadedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          statusLogs: {
            include: {
              changedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              changedAt: "desc",
            },
          },
        },
        orderBy: {
          intakeDate: "desc",
        },
      },
    },
  });

  if (!vehicle) {
    throw new NotFoundError("Vehiculo no encontrado");
  }

  const currentOrder = getCurrentOrLatestWorkOrder(vehicle.workOrders);
  const featuredOrder = currentOrder ?? vehicle.workOrders[0] ?? null;

  return {
    ...vehicle,
    currentOrder,
    featuredOrder,
    progressPercent: currentOrder ? getWorkOrderProgressPercent(currentOrder.status) : 0,
  };
}
