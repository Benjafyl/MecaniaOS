import { WorkOrderStatus } from "@prisma/client";

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  RECEIVED: "Recibido",
  IN_DIAGNOSIS: "En diagnostico",
  WAITING_APPROVAL: "Esperando aprobacion",
  WAITING_PARTS: "Esperando repuestos",
  IN_REPAIR: "En reparacion",
  IN_PAINT: "En pintura",
  READY_FOR_DELIVERY: "Listo para entrega",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const WORK_ORDER_STATUS_OPTIONS = Object.entries(WORK_ORDER_STATUS_LABELS).map(
  ([value, label]) => ({
    value: value as WorkOrderStatus,
    label,
  }),
);

export function isClosedStatus(status: WorkOrderStatus) {
  return status === WorkOrderStatus.DELIVERED || status === WorkOrderStatus.CANCELLED;
}
