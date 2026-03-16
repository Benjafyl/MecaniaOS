import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function getHistoryByVehicleId(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      client: true,
      workOrders: {
        include: {
          statusLogs: {
            include: {
              changedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  active: true,
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

  return vehicle;
}

export async function getHistoryByVin(vin: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      vin: vin.toUpperCase(),
    },
    select: {
      id: true,
    },
  });

  if (!vehicle) {
    throw new NotFoundError("Vehiculo no encontrado");
  }

  return getHistoryByVehicleId(vehicle.id);
}
