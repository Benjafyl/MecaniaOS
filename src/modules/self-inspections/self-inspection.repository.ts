import { Prisma, SelfInspectionRiskLevel, SelfInspectionStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const selfInspectionListInclude = {
  customer: true,
  vehicle: true,
  vehicleSnapshot: true,
  answers: {
    select: {
      questionKey: true,
      questionLabel: true,
      answerValue: true,
      severity: true,
      section: true,
    },
  },
  reviews: {
    orderBy: {
      reviewedAt: "desc" as const,
    },
    take: 1,
    include: {
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
      },
    },
  },
  _count: {
    select: {
      answers: true,
      photos: true,
      notes: true,
    },
  },
} satisfies Prisma.SelfInspectionInclude;

const selfInspectionDetailInclude = {
  customer: true,
  vehicle: true,
  workOrder: true,
  reviewer: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  },
  vehicleSnapshot: true,
  answers: {
    orderBy: [
      {
        section: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },
  photos: {
    orderBy: [
      {
        sortOrder: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },
  notes: {
    include: {
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
      createdAt: "asc" as const,
    },
  },
  reviews: {
    include: {
      reviewedBy: {
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
      reviewedAt: "desc" as const,
    },
  },
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
      changedAt: "desc" as const,
    },
  },
} satisfies Prisma.SelfInspectionInclude;

const publicWizardInclude = {
  customer: {
    include: {
      vehicles: {
        orderBy: {
          createdAt: "desc" as const,
        },
      },
    },
  },
  vehicle: true,
  vehicleSnapshot: true,
  answers: true,
  photos: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
  notes: {
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.SelfInspectionInclude;

export const selfInspectionRepository = {
  list(filters?: { search?: string; status?: SelfInspectionStatus; risk?: SelfInspectionRiskLevel }) {
    const where: Prisma.SelfInspectionWhereInput = {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.risk ? { overallRiskLevel: filters.risk } : {}),
      ...(filters?.search
        ? {
            OR: [
              {
                mainComplaint: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
              {
                customer: {
                  fullName: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              },
              {
                vehicle: {
                  plate: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              },
              {
                vehicle: {
                  vin: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              },
              {
                vehicleSnapshot: {
                  plate: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              },
              {
                vehicleSnapshot: {
                  vin: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    return prisma.selfInspection.findMany({
      where,
      include: selfInspectionListInclude,
      orderBy: [
        {
          submittedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  },

  findById(id: string) {
    return prisma.selfInspection.findUnique({
      where: { id },
      include: selfInspectionDetailInclude,
    });
  },

  findByAccessTokenHash(accessTokenHash: string) {
    return prisma.selfInspection.findFirst({
      where: {
        accessTokenHash,
      },
      include: publicWizardInclude,
    });
  },

  findPublicById(id: string) {
    return prisma.selfInspection.findUnique({
      where: { id },
      include: publicWizardInclude,
    });
  },

  findSummaryById(id: string) {
    return prisma.selfInspection.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        vehicleSnapshot: true,
        answers: true,
        photos: true,
        notes: true,
      },
    });
  },

  create(data: Prisma.SelfInspectionCreateInput) {
    return prisma.selfInspection.create({
      data,
    });
  },

  update(id: string, data: Prisma.SelfInspectionUpdateInput) {
    return prisma.selfInspection.update({
      where: { id },
      data,
    });
  },
};
