import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { normalizeError } from "@/lib/errors";
import { formatDate, formatDateTime } from "@/lib/utils";
import { getWorkOrderById } from "@/modules/work-orders/work-order.service";
import { StatusForm } from "@/app/(protected)/work-orders/status-form";
import { WORK_ORDER_STATUS_LABELS } from "@/modules/work-orders/work-order.constants";

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
                <span className="font-semibold text-[color:var(--foreground)]">Observaciones:</span>{" "}
                {workOrder.notes ?? "Sin observaciones"}
              </p>
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
          <h2 className="font-heading text-2xl font-semibold">Bitacora de estados</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Historial cronologico de la reparacion.
          </p>

          <div className="mt-6 space-y-4">
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
        </Card>
      </div>
    </div>
  );
}
