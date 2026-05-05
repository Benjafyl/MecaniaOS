import { Card } from "@/components/ui/card";
import {
  TrashActionRow,
  TrashEmptyState,
  TrashMeta,
  TrashPageHeader,
} from "@/components/trash/trash-ui";
import { listTrashItems, TRASH_RETENTION_DAYS } from "@/modules/trash/trash.service";

export default async function VehiclesTrashPage() {
  const { vehicles } = await listTrashItems();

  return (
    <div className="space-y-6">
      <TrashPageHeader
        backHref="/vehicles"
        backLabel="Volver a vehiculos"
        count={vehicles.length}
        description={`Aqui solo ves vehiculos enviados a papelera. Puedes recuperarlos antes de ${TRASH_RETENTION_DAYS} dias o eliminarlos definitivamente.`}
        eyebrow="Vehiculos eliminados"
        title="Papelera de vehiculos"
      />

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
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
              <TrashActionRow
                entityId={vehicle.id}
                entityType="vehicle"
                redirectTo="/vehicles/trash"
              />
            </div>
          </Card>
        ))}

        {vehicles.length === 0 ? (
          <TrashEmptyState label="No hay vehiculos en papelera por ahora." />
        ) : null}
      </div>
    </div>
  );
}
