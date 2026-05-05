import Link from "next/link";
import { WorkOrderStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { MoveToTrashButton, SectionTrashLink } from "@/components/trash/trash-ui";
import { formatDate } from "@/lib/utils";
import { getCurrentSession } from "@/modules/auth/auth.service";
import {
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUS_OPTIONS,
  isClosedStatus,
} from "@/modules/work-orders/work-order.constants";
import { listWorkOrders } from "@/modules/work-orders/work-order.service";

type WorkOrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: WorkOrderStatus;
  }>;
};

export default async function WorkOrdersPage({ searchParams }: WorkOrdersPageProps) {
  const { q, status } = await searchParams;
  const session = await getCurrentSession();
  const workOrders = await listWorkOrders({
    search: q,
    status,
    actorId: session?.user.id,
    actorRole: session?.user.role,
  });
  const openOrders = workOrders.filter((order) => !isClosedStatus(order.status)).length;
  const waitingApproval = workOrders.filter(
    (order) => order.status === WorkOrderStatus.WAITING_APPROVAL,
  ).length;
  const readyForDelivery = workOrders.filter(
    (order) => order.status === WorkOrderStatus.READY_FOR_DELIVERY,
  ).length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(239,246,255,0.94)_100%)]">
        <div className="space-y-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Nucleo operativo
              </p>
              <h1 className="mt-2 font-heading text-3xl font-semibold">Ordenes de trabajo</h1>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted-strong)]">
                Controla responsables, estados y prioridades con una vista clara para oficina y
                taller.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Abiertas" value={openOrders} />
              <HeroStat label="Esperando aprobacion" value={waitingApproval} />
              <HeroStat label="Listas para entrega" value={readyForDelivery} />
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <form className="flex flex-col gap-3 sm:flex-row xl:min-w-[640px]" method="get">
              <Input
                defaultValue={q}
                name="q"
                placeholder="Buscar por OT, cliente, VIN o patente"
              />
              <Select defaultValue={status ?? ""} name="status">
                <option value="">Todos los estados</option>
                {WORK_ORDER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Button className="sm:min-w-[120px]" type="submit" variant="secondary">
                Filtrar
              </Button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/work-orders/new">
                <Button className="w-full sm:w-auto">Nueva orden</Button>
              </Link>
              <SectionTrashLink href="/work-orders/trash" />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {workOrders.map((order) => (
          <Card className="rounded-xl" key={order.id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-2xl font-semibold">{order.orderNumber}</h2>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {order.client.fullName} / {order.vehicle.make} {order.vehicle.model}
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  Tecnico: {order.assignedTechnician?.name ?? "Sin asignar"}
                </p>
                <p className="text-sm text-[color:var(--muted)]">{order.reason}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:items-center">
                <MoveToTrashButton
                  entityId={order.id}
                  entityType="workOrder"
                  redirectTo="/work-orders"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-medium">
                    Ingreso {formatDate(order.intakeDate)}
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-medium">
                    {WORK_ORDER_STATUS_LABELS[order.status]}
                  </div>
                  <Link
                    className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                    href={`/work-orders/${order.id}`}
                  >
                    Abrir orden
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {workOrders.length === 0 ? (
          <Card className="rounded-xl text-center">
            <p className="text-[color:var(--muted-strong)]">
              No hay ordenes de trabajo con esos filtros.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[rgba(37,99,235,0.12)] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(37,99,235,0.06)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
