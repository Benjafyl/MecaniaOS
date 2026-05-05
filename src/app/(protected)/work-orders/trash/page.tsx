import { Card } from "@/components/ui/card";
import {
  TrashActionRow,
  TrashEmptyState,
  TrashMeta,
  TrashPageHeader,
} from "@/components/trash/trash-ui";
import { WORK_ORDER_STATUS_LABELS } from "@/modules/work-orders/work-order.constants";
import { listTrashItems, TRASH_RETENTION_DAYS } from "@/modules/trash/trash.service";

export default async function WorkOrdersTrashPage() {
  const { workOrders } = await listTrashItems();

  return (
    <div className="space-y-6">
      <TrashPageHeader
        backHref="/work-orders"
        backLabel="Volver a ordenes"
        count={workOrders.length}
        description={`Aqui solo ves ordenes de trabajo enviadas a papelera. Puedes recuperarlas antes de ${TRASH_RETENTION_DAYS} dias o eliminarlas definitivamente.`}
        eyebrow="Ordenes eliminadas"
        title="Papelera de ordenes"
      />

      <div className="space-y-4">
        {workOrders.map((order) => (
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
              <TrashActionRow
                entityId={order.id}
                entityType="workOrder"
                redirectTo="/work-orders/trash"
              />
            </div>
          </Card>
        ))}

        {workOrders.length === 0 ? (
          <TrashEmptyState label="No hay ordenes en papelera por ahora." />
        ) : null}
      </div>
    </div>
  );
}
