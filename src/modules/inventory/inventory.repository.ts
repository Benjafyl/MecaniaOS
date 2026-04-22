import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const inventoryRepository = {
  listRepuestos(search?: string) {
    const where: Prisma.RepuestoWhereInput | undefined = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined;

    return prisma.repuesto.findMany({
      where,
      orderBy: [{ currentStock: "asc" }, { name: "asc" }],
    });
  },

  listAvailableRepuestos() {
    return prisma.repuesto.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        currentStock: true,
        minimumStock: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  listRecentMovements(limit = 25) {
    return prisma.stockMovement.findMany({
      include: {
        repuesto: true,
        createdBy: {
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
        createdAt: "desc",
      },
      take: limit,
    });
  },
};
