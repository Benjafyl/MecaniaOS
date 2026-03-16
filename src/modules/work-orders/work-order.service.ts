import { WorkOrderStatus } from "@prisma/client";

import { ConflictError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/utils";
import { isClosedStatus } from "@/modules/work-orders/work-order.constants";
import { workOrderRepository } from "@/modules/work-orders/work-order.repository";
import {
  createWorkOrderSchema,
  updateWorkOrderSchema,
  updateWorkOrderStatusSchema,
} from "@/modules/work-orders/work-order.schemas";

async function assertClientVehicleMatch(clientId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: {
      id: true,
      clientId: true,
    },
  });

  if (!vehicle) {
    throw new NotFoundError("Vehiculo no encontrado");
  }

  if (vehicle.clientId !== clientId) {
    throw new ConflictError("El vehiculo no pertenece al cliente seleccionado");
  }
}

async function getNextOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `OT-${year}-`;
  const lastOrder = await workOrderRepository.findLastOrderNumberForYear(prefix);
  const nextSequence = lastOrder ? Number(lastOrder.orderNumber.slice(-4)) + 1 : 1;

  return `${prefix}${String(nextSequence).padStart(4, "0")}`;
}

export async function listWorkOrders(input?: { search?: string; status?: WorkOrderStatus }) {
  return workOrderRepository.list({
    search: input?.search?.trim(),
    status: input?.status,
  });
}

export async function getWorkOrderById(id: string) {
  const workOrder = await workOrderRepository.findById(id);

  if (!workOrder) {
    throw new NotFoundError("Orden de trabajo no encontrada");
  }

  return workOrder;
}

export async function createWorkOrder(input: unknown, actorId: string) {
  const data = createWorkOrderSchema.parse(input);
  await assertClientVehicleMatch(data.clientId, data.vehicleId);

  const orderNumber = await getNextOrderNumber();

  return prisma.$transaction(async (tx) => {
    const workOrder = await tx.workOrder.create({
      data: {
        orderNumber,
        clientId: data.clientId,
        vehicleId: data.vehicleId,
        reason: data.reason,
        initialDiagnosis: data.initialDiagnosis,
        status: data.status,
        estimatedDate: parseDateInput(data.estimatedDate),
        notes: data.notes,
        createdById: actorId,
        updatedById: actorId,
      },
    });

    await tx.workOrderStatusLog.create({
      data: {
        workOrderId: workOrder.id,
        previousStatus: null,
        nextStatus: data.status,
        note: "Estado inicial de la orden",
        changedById: actorId,
      },
    });

    return workOrder;
  });
}

export async function updateWorkOrder(id: string, input: unknown, actorId: string) {
  const data = updateWorkOrderSchema.parse(input);
  const existing = await prisma.workOrder.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Orden de trabajo no encontrada");
  }

  const nextStatus = data.status ?? existing.status;

  return prisma.$transaction(async (tx) => {
    const workOrder = await tx.workOrder.update({
      where: { id },
      data: {
        reason: data.reason,
        initialDiagnosis: data.initialDiagnosis,
        status: nextStatus,
        estimatedDate:
          data.estimatedDate === undefined ? undefined : parseDateInput(data.estimatedDate),
        notes: data.notes,
        updatedById: actorId,
        closedDate: isClosedStatus(nextStatus) ? new Date() : null,
      },
    });

    if (data.status && data.status !== existing.status) {
      await tx.workOrderStatusLog.create({
        data: {
          workOrderId: id,
          previousStatus: existing.status,
          nextStatus: data.status,
          note: "Cambio de estado desde edicion de orden",
          changedById: actorId,
        },
      });
    }

    return workOrder;
  });
}

export async function updateWorkOrderStatus(id: string, input: unknown, actorId: string) {
  const data = updateWorkOrderStatusSchema.parse(input);
  const existing = await prisma.workOrder.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Orden de trabajo no encontrada");
  }

  if (existing.status === data.status) {
    return getWorkOrderById(id);
  }

  await prisma.$transaction(async (tx) => {
    await tx.workOrder.update({
      where: { id },
      data: {
        status: data.status,
        updatedById: actorId,
        closedDate: isClosedStatus(data.status) ? new Date() : null,
      },
    });

    await tx.workOrderStatusLog.create({
      data: {
        workOrderId: id,
        previousStatus: existing.status,
        nextStatus: data.status,
        note: data.note,
        changedById: actorId,
      },
    });
  });

  return getWorkOrderById(id);
}
