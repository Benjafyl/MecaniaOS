import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { normalizeError } from "@/lib/errors";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  getAssignableMechanics,
  getWorkOrderById,
} from "@/modules/work-orders/work-order.service";
import { AssignmentForm } from "@/app/(protected)/work-orders/assignment-form";
import { EvidenceUploadForm } from "@/app/(protected)/work-orders/evidence-upload-form";
import { StatusForm } from "@/app/(protected)/work-orders/status-form";
import { WORK_ORDER_STATUS_LABELS } from "@/modules/work-orders/work-order.constants";
import { BUDGET_ITEM_TYPE_LABELS, BUDGET_STATUS_LABELS } from "@/modules/budgets/budget.constants";

type WorkOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkOrderDetailPage({ params }: WorkOrderDetailPageProps) {
  const { id } = await params;
  const workOrder = await getWorkOrderById(id).catch((error) => {
    if (normalizeError(error).statusCode === 404) {
      notFound();
    }

    throw error;
  });
  const mechanics = await getAssignableMechanics();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Orden de trabajo
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl font-semibold">{workOrder.orderNumber}</h1>
              <StatusBadge status={workOrder.status} />
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted-strong)]">
              {workOrder.client.fullName} / {workOrder.vehicle.make} {workOrder.vehicle.model} /{" "}
              {workOrder.vehicle.plate ?? "Sin patente"}
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{workOrder.reason}</p>
          </div>

          <div className="flex gap-3">
            {workOrder.budget ? (
              <Link href={`/budgets/${workOrder.budget.id}`}>
                <Button variant="secondary">Ver presupuesto</Button>
              </Link>
            ) : null}
            <Link href={`/vehicles/${workOrder.vehicleId}`}>
              <Button variant="secondary">Ver vehiculo</Button>
            </Link>
            <Link href="/work-orders/new">
              <Button>Nueva orden</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card className="rounded-2xl">
            <h2 className="font-heading text-2xl font-semibold">Resumen tecnico</h2>

            <div className="mt-5 space-y-3 text-sm text-[color:var(--muted-strong)]">
              {workOrder.budget ? (
                <div className="rounded-xl border border-[rgba(22,163,74,0.18)] bg-[rgba(22,163,74,0.05)] p-4">
                  <p className="text-sm font-semibold text-[#166534]">
                    Origen: presupuesto {workOrder.budget.budgetNumber}
                  </p>
                  <p className="mt-1 text-sm text-[#166534]">
                    Estado origen: {BUDGET_STATUS_LABELS[workOrder.budget.status]}
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#166534]">Repuestos</p>
                      <p className="mt-1 text-lg font-semibold text-[#14532d]">
                        ${workOrder.budget.subtotalParts.toLocaleString("es-CL")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#166534]">Mano de obra</p>
                      <p className="mt-1 text-lg font-semibold text-[#14532d]">
                        ${workOrder.budget.subtotalLabor.toLocaleString("es-CL")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#166534]">Total aprobado</p>
                      <p className="mt-1 text-lg font-semibold text-[#14532d]">
                        ${workOrder.budget.totalAmount.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Diagnostico:</span>{" "}
                {workOrder.initialDiagnosis ?? "Sin diagnostico inicial"}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Fecha ingreso:</span>{" "}
                {formatDate(workOrder.intakeDate)}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Fecha estimada:</span>{" "}
                {formatDate(workOrder.estimatedDate)}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Creada por:</span>{" "}
                {workOrder.createdBy.name}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Tecnico asignado:</span>{" "}
                {workOrder.assignedTechnician?.name ?? "Sin asignar"}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--foreground)]">Observaciones:</span>{" "}
                {workOrder.notes ?? "Sin observaciones"}
              </p>
            </div>
          </Card>

          {workOrder.budget ? (
            <Card className="rounded-2xl">
              <h2 className="font-heading text-2xl font-semibold">Items del presupuesto base</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Referencia directa de los repuestos, mano de obra y suministros que dieron origen a esta OT.
              </p>

              <div className="mt-5 space-y-3">
                {workOrder.budget.items.map((item) => (
                  <div
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3"
                    key={item.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--foreground)]">
                          {item.description}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          {BUDGET_ITEM_TYPE_LABELS[item.itemType]} / {item.referenceCode ?? "Sin codigo"}
                        </p>
                      </div>
                      <div className="text-right text-sm text-[color:var(--muted-strong)]">
                        <p>Cantidad: {item.quantity}</p>
                        <p>Unitario: ${item.unitPrice.toLocaleString("es-CL")}</p>
                        <p className="font-semibold text-[color:var(--foreground)]">
                          Subtotal: ${item.subtotal.toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="rounded-2xl">
            <h2 className="font-heading text-2xl font-semibold">Asignacion</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Define el mecanico responsable para su vista de trabajo diaria.
            </p>

            <div className="mt-5">
              <AssignmentForm
                currentAssignedTechnicianId={workOrder.assignedTechnicianId}
                mechanics={mechanics.map((mechanic) => ({
                  id: mechanic.id,
                  name: mechanic.name,
                }))}
                orderId={workOrder.id}
              />
            </div>
          </Card>

          <Card className="rounded-2xl">
            <h2 className="font-heading text-2xl font-semibold">Cambiar estado</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Cada cambio queda registrado para trazabilidad.
            </p>

            <div className="mt-5">
              <StatusForm currentStatus={workOrder.status} orderId={workOrder.id} />
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Evidencias de la orden</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Adjunta imagenes del proceso para mantener historial visual de la reparacion.
              </p>
            </div>

            <EvidenceUploadForm orderId={workOrder.id} />

            <div className="grid gap-4 md:grid-cols-2">
              {workOrder.evidences.map((evidence) => (
                <div
                  className="rounded-xl border border-[color:var(--border)] bg-white/70 p-3"
                  key={evidence.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={evidence.fileName}
                    className="h-44 w-full rounded-xl object-cover"
                    src={evidence.fileUrl}
                  />
                  <p className="mt-3 text-sm font-semibold text-[color:var(--foreground)]">
                    {evidence.fileName}
                  </p>
                  {evidence.note ? (
                    <p className="mt-1 text-xs text-[color:var(--muted-strong)]">{evidence.note}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    {evidence.uploadedBy.name} / {formatDateTime(evidence.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            {workOrder.evidences.length === 0 ? (
              <p className="text-sm text-[color:var(--muted)]">
                Aun no hay evidencias adjuntas a esta orden.
              </p>
            ) : null}

            <div>
              <h2 className="font-heading text-2xl font-semibold">Bitacora de estados</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Historial cronologico de la reparacion.
              </p>
            </div>

            <div className="space-y-4">
              {workOrder.statusLogs.map((log) => (
                <div
                  className="rounded-lg border border-[color:var(--border)] bg-white/70 p-4"
                  key={log.id}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={log.nextStatus} />
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      {WORK_ORDER_STATUS_LABELS[log.nextStatus]}
                    </p>
                  </div>
                  {log.previousStatus ? (
                    <p className="mt-2 text-sm text-[color:var(--muted-strong)]">
                      Desde {WORK_ORDER_STATUS_LABELS[log.previousStatus]}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {log.note ?? "Sin nota"}
                  </p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    {log.changedBy.name} / {formatDateTime(log.changedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
