import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const userRepository = {
  listInternalUsers() {
    return prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.ADMIN, UserRole.MECHANIC, UserRole.LIQUIDATOR],
        },
      },
      orderBy: [
        {
          role: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  },

  listMechanics() {
    return prisma.user.findMany({
      where: {
        role: UserRole.MECHANIC,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
  },

  listLiquidators() {
    return prisma.user.findMany({
      where: {
        role: UserRole.LIQUIDATOR,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    clientId?: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        ...(data.clientId
          ? {
              client: {
                connect: {
                  id: data.clientId,
                },
              },
            }
          : {}),
      },
    });
  },

  linkClient(id: string, clientId: string) {
    return prisma.user.update({
      where: { id },
      data: {
        client: {
          connect: {
            id: clientId,
          },
        },
      },
    });
  },

  update(
    id: string,
    data: {
      role: UserRole;
      active: boolean;
      passwordHash?: string;
    },
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
