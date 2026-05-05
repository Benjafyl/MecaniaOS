import { BudgetStatus, UserRole, WorkOrderStatus } from "@prisma/client";

import { AppError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/utils";
import { requireApiUser } from "@/modules/auth/auth.service";
import {
  InsuranceCaseDetailRecord,
  InsuranceCaseListRecord,
  insuranceCaseRepository,
} from "@/modules/insurance-cases/insurance-case.repository";
import { createInsuranceCaseSchema } from "@/modules/insurance-cases/insurance-case.schemas";
import { saveInsuranceCasePhotoFile } from "@/modules/insurance-cases/insurance-case.storage";
import { getWorkOrderProgressPercent, isClosedStatus } from "@/modules/work-orders/work-order.constants";

export const INSURANCE_CASE_STAGE_LABELS = {
  INGRESADO: "Ingresado",
  PRESUPUESTADO: "Presupuestado",
  EN_REPARACION: "En reparacion",
  LISTO: "Listo",
} as const;

export type InsuranceCaseStage = keyof typeof INSURANCE_CASE_STAGE_LABELS;

function startOfToday() {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfToday(start: Date) {
  const value = new Date(start);
  value.setDate(value.getDate() + 1);
  return value;
}

async function createInsuranceCaseNumber() {
  const start = startOfToday();
  const end = endOfToday(start);
  const count = await insuranceCaseRepository.countCreatedToday(start, end);
  const stamp = start.toISOString().slice(0, 10).replace(/-/g, "");

  return `SIN-${stamp}-${String(count + 1).padStart(3, "0")}`;
}

function getCurrentOrLatestWorkOrder<T extends { status: WorkOrderStatus }>(workOrders: T[]) {
  return workOrders.find((workOrder) => !isClosedStatus(workOrder.status)) ?? workOrders[0] ?? null;
}

function resolveInsuranceCaseStage(input: {
  latestBudget: { status: BudgetStatus } | null;
  currentWorkOrder: { status: WorkOrderStatus } | null;
}) {
  if (
    input.currentWorkOrder &&
    (input.currentWorkOrder.status === WorkOrderStatus.READY_FOR_DELIVERY ||
      input.currentWorkOrder.status === WorkOrderStatus.DELIVERED)
  ) {
    return "LISTO" as const;
  }

  if (input.currentWorkOrder) {
    return "EN_REPARACION" as const;
  }

  if (input.latestBudget) {
    return "PRESUPUESTADO" as const;
  }

  return "INGRESADO" as const;
}

function summarizeInsuranceCaseList(record: InsuranceCaseListRecord) {
  const latestBudget = record.budgets[0] ?? null;
  const currentWorkOrder =
    latestBudget?.workOrder ?? getCurrentOrLatestWorkOrder(record.workOrders);
  const stage = resolveInsuranceCaseStage({
    latestBudget,
    currentWorkOrder,
  });

  return {
    ...record,
    latestBudget,
    currentWorkOrder,
    stage,
    stageLabel: INSURANCE_CASE_STAGE_LABELS[stage],
    progressPercent: currentWorkOrder ? getWorkOrderProgressPercent(currentWorkOrder.status) : 0,
    hasPendingBudgetDecision: latestBudget?.status === BudgetStatus.SENT,
    readyForDelivery:
      currentWorkOrder?.status === WorkOrderStatus.READY_FOR_DELIVERY ||
      currentWorkOrder?.status === WorkOrderStatus.DELIVERED,
  };
}

function summarizeInsuranceCaseDetail(record: InsuranceCaseDetailRecord) {
  const latestBudget = record.budgets[0] ?? null;
  const currentWorkOrder =
    latestBudget?.workOrder ?? getCurrentOrLatestWorkOrder(record.workOrders);
  const stage = resolveInsuranceCaseStage({
    latestBudget,
    currentWorkOrder,
  });

  return {
    ...record,
    latestBudget,
    currentWorkOrder,
    stage,
    stageLabel: INSURANCE_CASE_STAGE_LABELS[stage],
    progressPercent: currentWorkOrder ? getWorkOrderProgressPercent(currentWorkOrder.status) : 0,
    hasPendingBudgetDecision: latestBudget?.status === BudgetStatus.SENT,
    readyForDelivery:
      currentWorkOrder?.status === WorkOrderStatus.READY_FOR_DELIVERY ||
      currentWorkOrder?.status === WorkOrderStatus.DELIVERED,
  };
}

async function assertClientVehicleMatch(clientId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      clientId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!vehicle) {
    throw new AppError("El vehiculo seleccionado no pertenece al cliente indicado", 422);
  }
}

export async function findLatestInsuranceCaseLink(clientId: string, vehicleId: string) {
  return insuranceCaseRepository.findLatestByClientVehicle(clientId, vehicleId);
}

export async function createInsuranceCaseByLiquidator(
  input: unknown,
  files: File[],
  liquidatorId: string,
) {
  const data = createInsuranceCaseSchema.parse(input);

  if (files.length === 0) {
    throw new AppError(
      "Debes adjuntar al menos una foto inicial del siniestro para enviar la solicitud.",
      422,
    );
  }

  await assertClientVehicleMatch(data.clientId, data.vehicleId);
  const matchingCase = await insuranceCaseRepository.findLatestByClientVehicle(
    data.clientId,
    data.vehicleId,
  );

  if (matchingCase && matchingCase.liquidatorId !== liquidatorId) {
    throw new UnauthorizedError(
      "Este vehiculo ya tiene un caso asignado a otro liquidador. Pide al taller que lo reasigne.",
    );
  }

  const insuranceCase = await insuranceCaseRepository.create({
    caseNumber: await createInsuranceCaseNumber(),
    clientId: data.clientId,
    vehicleId: data.vehicleId,
    liquidatorId,
    claimNumber: data.claimNumber,
    policyNumber: data.policyNumber,
    incidentDate: parseDateInput(data.incidentDate) ?? new Date(),
    incidentLocation: data.incidentLocation,
    description: data.description,
  });

  const savedPhotos = [];

  for (const file of files) {
    const saved = await saveInsuranceCasePhotoFile({
      insuranceCaseId: insuranceCase.id,
      file,
    });

    savedPhotos.push(saved);
  }

  return insuranceCaseRepository.createPhotos(
    insuranceCase.id,
    savedPhotos.map((photo) => ({
      fileUrl: photo.fileUrl,
      storageKey: photo.storageKey,
      fileName: photo.fileName,
      mimeType: photo.mimeType,
      sizeBytes: photo.sizeBytes,
    })),
  );
}

export async function listInternalInsuranceCases() {
  const cases = await insuranceCaseRepository.listForInternal();
  return cases.map(summarizeInsuranceCaseList);
}

export async function getInsuranceCaseCreateContext() {
  await requireApiUser([UserRole.LIQUIDATOR]);

  const clients = await prisma.client.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      vehicles: {
        where: {
          deletedAt: null,
        },
        orderBy: [{ make: "asc" }, { model: "asc" }],
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });

  return {
    clients,
    vehicles: clients.flatMap((client) =>
      client.vehicles.map((vehicle) => ({
        ...vehicle,
        clientName: client.fullName,
      })),
    ),
  };
}

export async function getInternalInsuranceCaseDetail(id: string) {
  const insuranceCase = await insuranceCaseRepository.findByIdForInternal(id);

  if (!insuranceCase) {
    throw new NotFoundError("Caso de seguro no encontrado");
  }

  return summarizeInsuranceCaseDetail(insuranceCase);
}

export async function getLiquidatorPortalOverview() {
  const session = await requireApiUser([UserRole.LIQUIDATOR]);
  const cases = (await insuranceCaseRepository.listForLiquidator(session.user.id)).map(
    summarizeInsuranceCaseList,
  );

  return {
    liquidator: session.user,
    cases,
    stats: {
      totalCases: cases.length,
      pendingBudgets: cases.filter((insuranceCase) => insuranceCase.hasPendingBudgetDecision)
        .length,
      activeRepairs: cases.filter(
        (insuranceCase) =>
          insuranceCase.currentWorkOrder &&
          insuranceCase.currentWorkOrder.status !== WorkOrderStatus.READY_FOR_DELIVERY &&
          insuranceCase.currentWorkOrder.status !== WorkOrderStatus.DELIVERED &&
          insuranceCase.currentWorkOrder.status !== WorkOrderStatus.CANCELLED,
      ).length,
      readyCases: cases.filter((insuranceCase) => insuranceCase.readyForDelivery).length,
    },
  };
}

export async function getLiquidatorInsuranceCaseDetail(id: string) {
  const session = await requireApiUser([UserRole.LIQUIDATOR]);
  const insuranceCase = await insuranceCaseRepository.findByIdForLiquidator(id, session.user.id);

  if (!insuranceCase) {
    throw new NotFoundError("Caso de seguro no encontrado");
  }

  return summarizeInsuranceCaseDetail(insuranceCase);
}

export async function respondToInsuranceBudget(
  budgetId: string,
  input: {
    nextStatus: BudgetStatus;
    note?: string;
  },
) {
  const session = await requireApiUser([UserRole.LIQUIDATOR]);
  const budget = await insuranceCaseRepository.findBudgetForLiquidator(budgetId, session.user.id);

  if (!budget || !budget.insuranceCase) {
    throw new NotFoundError("Presupuesto de aseguradora no encontrado");
  }

  if (budget.status !== BudgetStatus.SENT) {
    throw new AppError("Este presupuesto ya no admite respuesta del liquidador", 422);
  }

  return insuranceCaseRepository.transitionBudgetForLiquidator({
    budgetId: budget.id,
    previousStatus: budget.status,
    nextStatus: input.nextStatus,
    note: input.note?.trim() || undefined,
    changedById: session.user.id,
    changedAt: new Date(),
  });
}
