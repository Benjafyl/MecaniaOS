import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const userRepository = {
  listInternalUsers() {
    return prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.ADMIN, UserRole.MECHANIC],
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
  }) {
    return prisma.user.create({
      data,
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
