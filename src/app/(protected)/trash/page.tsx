import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { BUDGET_STATUS_LABELS } from "@/modules/budgets/budget.constants";
import { SELF_INSPECTION_STATUS_LABELS } from "@/modules/self-inspections/self-inspection.constants";
import { WORK_ORDER_STATUS_LABELS } from "@/modules/work-orders/work-order.constants";
import {
  listTrashItems,
  TRASH_RETENTION_DAYS,
  type TrashEntityType,
} from "@/modules/trash/trash.service";
import {
  deleteTrashItemForeverAction,
  restoreTrashItemAction,
} from "@/app/(protected)/trash/actions";

type TrashActionRowProps = {
  entityId: string;
  entityType: TrashEntityType;
  allowPermanentDelete?: boolean;
};

function TrashActionRow({
  entityId,
  entityType,
  allowPermanentDelete = true,
}: TrashActionRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={restoreTrashItemAction}>
        <input name="entityId" type="hidden" value={entityId} />
        <input name="entityType" type="hidden" value={entityType} />
        <Button type="submit" variant="secondary">
          Restaurar
        </Button>
      </form>

      {allowPermanentDelete ? (
        <form action={deleteTrashItemForeverAction}>
          <input name="entityId" type="hidden" value={entityId} />
          <input name="entityType" type="hidden" value={entityType} />
          <Button type="submit" variant="danger">
            Eliminar definitivo
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function TrashMeta({
  deletedAt,
  daysRemaining,
}: {
  deletedAt: Date | null;
  daysRemaining: number | null;
}) {
  return (
    <div className="text-sm text-[color:var(--muted)]">
      <p>En papelera desde {formatDateTime(deletedAt)}</p>
      <p>
        {daysRemaining === 0
          ? "Se elimina en la siguiente limpieza automatica."
          : `Quedan ${daysRemaining} dia${daysRemaining === 1 ? "" : "s"} para recuperarlo.`}
      </p>
    </div>
  );
}

export default async function TrashPage() {
  const trash = await listTrashItems();
  const totalItems =
    trash.clients.length +
    trash.vehicles.length +
    trash.workOrders.length +
    trash.budgets.length +
    trash.repuestos.length +
    trash.selfInspections.length;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Recuperacion y limpieza
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">Papelera</h1>
            <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-strong)]">
              Todo lo enviado a papelera se puede restaurar antes de {TRASH_RETENTION_DAYS} dias.
              Despues de ese plazo, se elimina automaticamente cuando el sistema ejecuta su
              limpieza interna.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--border)] bg-white/80 px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Elementos en papelera
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-[color:var(--foreground)]">
              {totalItems}
            </p>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <SectionTitle count={trash.clients.length} title="Clientes" />
        {trash.clients.map((client) => (
          <Card className="rounded-xl" key={client.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{client.fullName}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">{client.email}</p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {client._count.vehicles} vehiculos / {client._count.workOrders} ordenes /{" "}
                  {client._count.budgets} presupuestos asociados
                </p>
                <TrashMeta daysRemaining={client.daysRemaining} deletedAt={client.deletedAt} />
              </div>
              <TrashActionRow entityId={client.id} entityType="client" />
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle count={trash.vehicles.length} title="Vehiculos" />
        {trash.vehicles.map((vehicle) => (
          <Card className="rounded-xl" key={vehicle.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {vehicle.client.fullName} / {vehicle.plate ?? vehicle.vin}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {vehicle._count.workOrders} ordenes / {vehicle._count.budgets} presupuestos
                </p>
                <TrashMeta daysRemaining={vehicle.daysRemaining} deletedAt={vehicle.deletedAt} />
              </div>
              <TrashActionRow entityId={vehicle.id} entityType="vehicle" />
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle count={trash.workOrders.length} title="Ordenes de trabajo" />
        {trash.workOrders.map((order) => (
          <Card className="rounded-xl" key={order.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{order.orderNumber}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {order.client.fullName} / {order.vehicle.make} {order.vehicle.model} /{" "}
                    {order.vehicle.plate ?? "Sin patente"}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {WORK_ORDER_STATUS_LABELS[order.status]} / {order.reason}
                </p>
                <TrashMeta daysRemaining={order.daysRemaining} deletedAt={order.deletedAt} />
              </div>
              <TrashActionRow entityId={order.id} entityType="workOrder" />
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle count={trash.budgets.length} title="Presupuestos" />
        {trash.budgets.map((budget) => (
          <Card className="rounded-xl" key={budget.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{budget.title}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {budget.budgetNumber} / {budget.client.fullName}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  {BUDGET_STATUS_LABELS[budget.status]} / {budget.vehicle.make}{" "}
                  {budget.vehicle.model} / {budget.vehicle.plate ?? "Sin patente"}
                </p>
                <TrashMeta daysRemaining={budget.daysRemaining} deletedAt={budget.deletedAt} />
              </div>
              <TrashActionRow entityId={budget.id} entityType="budget" />
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle count={trash.repuestos.length} title="Repuestos" />
        {trash.repuestos.map((repuesto) => (
          <Card className="rounded-xl" key={repuesto.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{repuesto.name}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    Codigo {repuesto.code}
                  </p>
                </div>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  Stock al momento de borrar: {repuesto.currentStock}
                </p>
                <TrashMeta daysRemaining={repuesto.daysRemaining} deletedAt={repuesto.deletedAt} />
              </div>
              <TrashActionRow entityId={repuesto.id} entityType="repuesto" />
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle count={trash.selfInspections.length} title="Autoinspecciones asociadas" />
        {trash.selfInspections.map((inspection) => (
          <Card className="rounded-xl" key={inspection.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{inspection.customer.fullName}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                    {SELF_INSPECTION_STATUS_LABELS[inspection.status]} /{" "}
                    {inspection.vehicle?.plate ?? inspection.vehicle?.vin ?? "Sin vehiculo"}
                  </p>
                </div>
                <TrashMeta
                  daysRemaining={inspection.daysRemaining}
                  deletedAt={inspection.deletedAt}
                />
              </div>
              <TrashActionRow
                allowPermanentDelete={false}
                entityId={inspection.id}
                entityType="selfInspection"
              />
            </div>
          </Card>
        ))}
      </section>

      {totalItems === 0 ? (
        <Card className="rounded-xl text-center">
          <p className="text-[color:var(--muted-strong)]">
            La papelera esta vacia por ahora.
          </p>
        </Card>
      ) : null}
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <span className="rounded-full border border-[color:var(--border)] bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted-strong)]">
        {count}
      </span>
    </div>
  );
}
