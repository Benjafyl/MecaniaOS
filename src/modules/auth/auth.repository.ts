import { prisma } from "@/lib/prisma";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  findSessionByTokenHash(tokenHash: string) {
    return prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            clientId: true,
          },
        },
      },
    });
  },

  createSession(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.session.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  },

  deleteSessionByTokenHash(tokenHash: string) {
    return prisma.session.deleteMany({
      where: { tokenHash },
    });
  },
};
