import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const clientRepository = {
  list(search?: string) {
    const where: Prisma.ClientWhereInput | undefined = search
      ? {
          OR: [
            {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined;

    return prisma.client.findMany({
      where,
      include: {
        _count: {
          select: {
            vehicles: true,
            workOrders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        vehicles: {
          orderBy: {
            createdAt: "desc",
          },
        },
        workOrders: {
          include: {
            vehicle: true,
          },
          orderBy: {
            intakeDate: "desc",
          },
        },
      },
    });
  },

  findByEmail(email: string) {
    return prisma.client.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  },

  update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({
      where: { id },
      data,
    });
  },
};
